from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from .main import prisma

router = APIRouter()

class TeamCreate(BaseModel):
    name: str
    passcode: str

@router.post("/teams")
async def create_team(team: TeamCreate):
    existing = await prisma.team.find_unique(where={"name": team.name})
    if existing:
        raise HTTPException(status_code=400, detail="Team name already exists")
    
    new_team = await prisma.team.create(
        data={
            "name": team.name,
            "passcode": team.passcode
        }
    )
    return new_team

@router.get("/teams")
async def get_teams():
    return await prisma.team.find_many(order={"score": "desc"})

# TODO: Add API routes for questions, answers, and WebSockets for real-time sync
