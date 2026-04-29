from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prisma import Prisma

app = FastAPI(title="Hobo Reunion Quiz API")
prisma = Prisma()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

from .api import router as api_router
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Hobo Reunion Quiz API"}

from fastapi import WebSocket, WebSocketDisconnect
from .ws import manager

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # 必要に応じてクライアントからの直接メッセージを処理
    except WebSocketDisconnect:
        manager.disconnect(websocket)
