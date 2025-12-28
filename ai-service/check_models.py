import asyncio
import os
from dotenv import load_dotenv
from google import genai

load_dotenv(".env.local")
api_key = os.getenv("GOOGLE_API_KEY")

async def list_models():
    client = genai.Client(api_key=api_key)
    try:
        # The library seems to be google-genai based on tracebacks
        # We need to find the list_models equivalent in the async client or standard client
        # Based on traceback: client.aio.models.generate_content_stream
        
        # In the new SDK, it might be client.models.list()
        # let's try the synchronous version first for simplicity script
        
        print("Attempting to list models...")
        # Note: The traceback shows 'google.genai'. 
        # Typically: client.models.list()
        
        pager = client.models.list()
        for model in pager:
            print(f"Model: {model.name}")
            # print(f"  Display Name: {model.display_name}") 
            # safe print
            if hasattr(model, 'supported_generation_methods'):
                 print(f"  Methods: {model.supported_generation_methods}")
            print("-" * 20)
            
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    asyncio.run(list_models())
