from dotenv import load_dotenv
load_dotenv()
import asyncio
from memecoin_radar.api.routes import _run_pipeline

async def main():
    try:
        data = await _run_pipeline("CFGHJNKM")
        print(f"Final Score: {data['final'].score}")
        print(f"Social Score: {data['final'].social_score}")
        print(f"Onchain Score: {data['final'].onchain_score}")
        print(f"Hype: {data['hype'].phase}")
        import pprint
        print("Soc Features:")
        pprint.pprint(data['soc_features'].dict())
        print("Onchain Features:")
        pprint.pprint(data['oc_features'].dict())
        import os
        print("USE_MOCKS=", os.getenv("USE_MOCKS"))
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    asyncio.run(main())
