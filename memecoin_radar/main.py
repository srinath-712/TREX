import os
from fastapi import FastAPI
from dotenv import load_dotenv
from memecoin_radar.api.routes import router

load_dotenv()   # load .env before any module reads os.environ

app = FastAPI(
    title='MemeRadar API',
    description='Real-time meme coin trend detection platform',
    version='1.0.0'
)

app.include_router(router, prefix='')

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('memecoin_radar.main:app', host='0.0.0.0', port=8000, reload=True)
