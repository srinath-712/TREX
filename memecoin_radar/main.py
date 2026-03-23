import os
from fastapi import FastAPI
from dotenv import load_dotenv
from memecoin_radar.api.routes import router

load_dotenv()   # load .env before any module reads os.environ

from contextlib import asynccontextmanager
from memecoin_radar.storage.time_window_store import store
from memecoin_radar.models.schemas import CleanPost
from datetime import datetime, timezone

from memecoin_radar.api.routes import _run_pipeline
from memecoin_radar.api.ws_manager import manager
import asyncio

from memecoin_radar.pipelines.lunarcrush_pipeline import fetch_top_trending_coins

async def background_pipeline():
    while True:
        if manager.active_connections:
            # Only run pipeline for currently trending coins + watchlist
            trending = store.get_trending_coins()
            watchlist = store.get_watchlist()
            active_set = list(set(trending + watchlist))
            
            for coin in active_set:
                try:
                    await _run_pipeline(coin)
                except Exception:
                    pass
        await asyncio.sleep(4)

async def rotation_task():
    """Refreshes the top-4 trending coins from LunarCrush every 1 minute."""
    while True:
        try:
            trending = await fetch_top_trending_coins()
            store.set_trending_coins(trending)
            print(f"[ROTATION] Updated trending coins: {trending}")
        except Exception as e:
            print(f"[ERROR] Rotation task failed: {e}")
        await asyncio.sleep(60)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initial trending load
    initial_trending = await fetch_top_trending_coins()
    store.set_trending_coins(initial_trending)

    # Seed initial posts for trending coins
    for coin in initial_trending:
        store.add_posts(coin, [CleanPost(
            text=f"Initial seed post for {coin}",
            timestamp=datetime.now(timezone.utc),
            likes=10, comments=2, reposts=5,
            source='twitter', post_id=f"seed_{coin}",
            compound_score=0.5
        )])
        
    p_task = asyncio.create_task(background_pipeline())
    r_task = asyncio.create_task(rotation_task())
    yield
    p_task.cancel()
    r_task.cancel()

app = FastAPI(
    title='TREX API',
    description='Real-time meme coin trend detection platform',
    version='1.0.0',
    lifespan=lifespan
)

app.include_router(router, prefix='')

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('memecoin_radar.main:app', host='0.0.0.0', port=8000, reload=True)
