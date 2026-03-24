import asyncio
import os
from dotenv import load_dotenv
load_dotenv('.env')

from memecoin_radar.pipelines.lunarcrush_pipeline import fetch_lunarcrush_data

async def main():
    data = await fetch_lunarcrush_data("PEPE")
    print("Features:", data.get('features'))

if __name__ == "__main__":
    asyncio.run(main())
