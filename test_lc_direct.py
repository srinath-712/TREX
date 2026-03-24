import asyncio
import httpx
import os
from dotenv import load_dotenv
load_dotenv('.env')

async def main():
    LUNARCRUSH_API_KEY = os.getenv("LUNARCRUSH_API_KEY")
    headers = {"Authorization": f"Bearer {LUNARCRUSH_API_KEY}"}
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"https://lunarcrush.com/api4/public/coins/list/v1?limit=4&sort=social_score", headers=headers)
        print("Status", response.status_code)
        print("Response", response.text[:200])

if __name__ == "__main__":
    asyncio.run(main())
