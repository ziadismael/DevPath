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
    room_io,
    function_tool,
    RunContext,
    tokenize,
    tts,
    function_tool,
    RunContext
)
# IMPORT GOOGLE PLUGIN
# IMPORT GOOGLE PLUGIN
from livekit.plugins import noise_cancellation, silero, deepgram, google, openai

from prompts import TECHNICAL_PROMPT, BEHAVIORAL_PROMPT, BASE_INSTRUCTIONS

# --- LOGGING ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agent")

load_dotenv(".env.local")

# --- 1. SETUP GEMINI (Native Google Plugin) ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    logger.error("GOOGLE_API_KEY is missing! Get it at aistudio.google.com")

# Use the Native Google LLM (No more OpenAI compatibility errors)
llm_plugin = google.LLM(
    model="gemini-2.0-flash",
    api_key=GOOGLE_API_KEY,
    temperature=0.7,
)

server = AgentServer()

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load(
        min_speech_duration=0.1,
        min_silence_duration=0.5
    )
    proc.userdata["latest_code"] = ""

server.setup_fnc = prewarm

@server.rtc_session()
async def my_agent(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}

    # --- Tool for Code Analysis ---
    @function_tool(description="Analyze the user's code.")
    async def analyze_code_tool(tool_ctx: RunContext, code_snippet: str = ""):
        latest_code = ctx.proc.userdata.get("latest_code", "")
        
        target_code = ""
        if len(latest_code) > 10:
            target_code = latest_code
        elif code_snippet and len(code_snippet) > 10 and "provided_code" not in code_snippet:
            target_code = code_snippet
        
        if not target_code:
            return "SYSTEM_NOTICE: No code found. Ask user to write code."

        prompt = f"Analyze this code briefly:\n{target_code}"
        try:
            # We use the generic LiveKit ChatContext now
            chat_ctx = llm.ChatContext().append(
                text=prompt,
                role=llm.ChatRole.USER
            )
            
            response = await llm_plugin.chat(chat_ctx=chat_ctx)
            
            full_text = ""
            async for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    full_text += chunk.choices[0].delta.content
            return f"ANALYSIS:\n{full_text}"
        except Exception as e:
            return f"Error analyzing: {e}"

    class Assistant(Agent):
        def __init__(self, instructions: str) -> None:
            super().__init__(instructions=instructions, tools=[analyze_code_tool])

    # --- HUMAN STYLE ---
    HUMAN_STYLE = """
    \n\nSTYLE GUIDE:
    1. Be conversational, not robotic. 
    2. Use natural fillers (e.g., "Right," "I see," "Hmm").
    3. Keep responses concise. 
    4. PRONUNCIATION: Say 'Dev-Path' (not 'Depth').
    """
    
    agent = Assistant(instructions=BASE_INSTRUCTIONS + HUMAN_STYLE)
    
    # --- 2. SETUP DEEPGRAM (Voice) ---
    tts_stream_adapter = tts.StreamAdapter(
        tts=deepgram.TTS(model="aura-helios-en"), 
        sentence_tokenizer=tokenize.basic.SentenceTokenizer(
            min_sentence_len=5 
        )
    )
    # Initial Agent (Neutral)
    agent = Assistant(instructions=BASE_INSTRUCTIONS)
    
    # --- FREE TIER CONFIGURATION ---
    # STT: Deepgram Nova-2 (Fast & Cheap/Free)
    # LLM: Groq Llama3-70B (Free Tier)
    # TTS: Deepgram Aura (Free High Quality)
    
    session = AgentSession(
        stt=deepgram.STT(model="nova-2"),
        llm=llm_plugin,
        tts=deepgram.TTS(model="aura-helios-en"),
        vad=ctx.proc.userdata["vad"],
    )

    # --- USAGE LIMIT TIMER (5 Minutes) ---
    async def usage_timer():
        await asyncio.sleep(300) # 5 minutes = 300 seconds
        logger.info("Free limit reached (5m). Disconnecting user.")
        await ctx.disconnect()
    
    asyncio.create_task(usage_timer())

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
                    
                    session.say("Hello, Are you ready for our interview?", allow_interruptions=True)
                else:
                    logger.info("Switched to TECHNICAL mode")
                    new_instructions = f"SYSTEM OVERRIDE: SWITCH PERSONA NOW. \n\n{TECHNICAL_PROMPT}"
                    new_agent = Assistant(instructions=new_instructions)
                    
                    session.update_agent(new_agent)

                    session.say("Hello, Are you ready for our interview", allow_interruptions=True)
                
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

if __name__ == "__main__":
    cli.run_app(server)