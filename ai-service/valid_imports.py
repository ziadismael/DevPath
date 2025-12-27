try:
    from livekit.agents import AgentSession
    print("AgentSession Dir:", dir(AgentSession))
except ImportError as e:
    print("Could not import AgentSession:", e)
