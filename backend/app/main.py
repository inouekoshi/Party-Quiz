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
