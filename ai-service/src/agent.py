import logging
import json
import os
import asyncio
from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    cli,
    inference,
    room_io,
    function_tool,
    RunContext
)
from livekit.plugins import noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from huggingface_hub import InferenceClient

from prompts import TECHNICAL_PROMPT, BEHAVIORAL_PROMPT, BASE_INSTRUCTIONS

logger = logging.getLogger("agent")
load_dotenv(".env.local")

# Check for HF Token
token = os.getenv("HF_TOKEN")
if token:
    logger.info(f"HF_TOKEN loaded: {token[:4]}***")
else:
    logger.error("HF_TOKEN is missing or empty!")

# Initialize HF Client
hf_client = InferenceClient(api_key=token)

server = AgentServer()

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()
    # Initialize shared code storage
    proc.userdata["latest_code"] = ""

server.setup_fnc = prewarm

@server.rtc_session()
async def my_agent(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}

    # --- Tool Definition (Inside scope to access ctx.proc) ---
    @function_tool(description="Analyze the user's code for time complexity and syntax errors. Call this when the user asks to review their code.")
    async def analyze_code_tool(tool_ctx: RunContext, code_snippet: str = ""):
        # Access process userdata directly from the outer scope's ctx
        latest_code = ctx.proc.userdata.get("latest_code", "")
        
        # PRIORITIZE the LiveKit data packet code (Real-time Editor)
        if len(latest_code) > 5:
             logger.info("Using code from LIVE EDITOR (Data Packet)")
             target_code = latest_code
        else:
             logger.info("Using code from TOOL ARGUMENT (LLM Context)")
             target_code = code_snippet
        
        if not target_code:
            return "No code found to analyze. Please ask the user to type something in the editor."

        logger.info(f"🔍 FINAL CODE TO ANALYZE:\n{target_code}")
        logger.info(f"--------------------------------------------------")
        
        prompt = f"""
        You are a technical interviewer executing a code review. 
        Analyze the candidate's code snippet below.
        
        Guidelines:
        1. Do NOT rewrite or autocomplete the code.
        2. Identify logical errors, bugs, or missing edge cases.
        3. Ask the user about the Time and Space complexity (Big O) if they haven't mentioned it.
        4. Provide a hint for optimization if applicable, but do not give the answer.
        
        Candidate's Code:
        {target_code}
        """
        
        try:
             # Run in executor to avoid blocking the loop if sync
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: hf_client.chat_completion(
                    messages=[{"role": "user", "content": prompt}],
                    model="Qwen/Qwen2.5-Coder-32B-Instruct", 
                    max_tokens=500
                )
            )
            return f"SYSTEM ANALYSIS REPORT (Do not read this header):\n{response.choices[0].message.content}"
        except Exception as e:
            logger.error(f"Hugging Face Error: {e}")
            return "Error: Could not analyze code at this moment."

    # Define Agent locally
    class Assistant(Agent):
        def __init__(self, instructions: str) -> None:
            super().__init__(
                instructions=instructions,
                tools=[analyze_code_tool],
            )

    # Initial Agent (Neutral)
    agent = Assistant(instructions=BASE_INSTRUCTIONS)
    
    session = AgentSession(
        stt=inference.STT(model="assemblyai/universal-streaming", language="en"),
        llm=inference.LLM(model="openai/gpt-4o-mini"),
        tts=inference.TTS(model="cartesia/sonic-3", voice="9626c31c-bec5-4cca-baa8-f8ba9e84c8bc"),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
    )

    # --- Data Packet Handler ---
    @ctx.room.on("data_received")
    def on_data(data: rtc.DataPacket):
        try:
            logger.info(f"Raw data packet received: {data.data.decode('utf-8')}")
            payload = json.loads(data.data.decode("utf-8"))
            topic = payload.get("topic")

            if topic == "INIT":
                mode = payload.get("mode", "technical")
                logger.info(f"Setting interview mode to: {mode}")
                
                # Switch Persona by updating the Agent
                if mode == "behavioral":
                    logger.info("Switched to BEHAVIORAL mode")
                    new_instructions = f"SYSTEM OVERRIDE: SWITCH PERSONA NOW. \n\n{BEHAVIORAL_PROMPT}"
                    new_agent = Assistant(instructions=new_instructions)
                    
                    session.update_agent(new_agent)
                    
                    asyncio.create_task(session.say("Hello, Are you ready for our interview?", allow_interruptions=True))
                else:
                    logger.info("Switched to TECHNICAL mode")
                    new_instructions = f"SYSTEM OVERRIDE: SWITCH PERSONA NOW. \n\n{TECHNICAL_PROMPT}"
                    new_agent = Assistant(instructions=new_instructions)
                    
                    session.update_agent(new_agent)

                    asyncio.create_task(session.say("Hello, Are you ready for our interview", allow_interruptions=True))
                
            elif topic == "CODE_UPDATE":
                code = payload.get("code")
                ctx.proc.userdata["latest_code"] = code
                logger.info(f"Updated latest code ({len(code)} chars)")

        except Exception as e:
            logger.error(f"Failed to process data packet: {e}")

    await session.start(
        agent=agent,
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: noise_cancellation.BVCTelephony()
                if params.participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                else noise_cancellation.BVC(),
            ),
        ),
    )

    await ctx.connect()
    # Removed initial greeting to wait for INIT packet

if __name__ == "__main__":
    cli.run_app(server)
