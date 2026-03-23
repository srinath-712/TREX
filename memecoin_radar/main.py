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

async def background_pipeline():
    while True:
        if manager.active_connections:
            tracked = store.get_tracked_coins()
            for coin in tracked[:5]:
                try:
                    await _run_pipeline(coin)
                except Exception:
                    pass
        await asyncio.sleep(4)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed with some initial coins for the /coins endpoint to work
    for coin in ['PEPE', 'DOGE', 'SHIB', 'FLOKI', 'BONK']:
        store.add_posts(coin, [CleanPost(
            text="Initial seed post",
            timestamp=datetime.now(timezone.utc),
            likes=10, comments=2, reposts=5,
            source='twitter', post_id=f"seed_{coin}",
            compound_score=0.5
        )])
        
    task = asyncio.create_task(background_pipeline())
    yield
    task.cancel()

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
