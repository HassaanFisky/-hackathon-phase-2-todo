from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from utils.intent_parser import parse_intent

# Define Input/Output Models
class IntentInput(BaseModel):
    text: str

class IntentOutput(BaseModel):
    parsed: bool
    data: Dict[str, Any]

intent_router = APIRouter(prefix="/intent", tags=["Intent"])

@intent_router.post("/", response_model=IntentOutput)
async def process_intent(payload: IntentInput):
    """
    Process raw text into structured intent.
    No external API calls. Pure logic.
    """
    if not payload.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    try:
        result = parse_intent(payload.text)
        return IntentOutput(
            parsed=True,
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Intent parsing failed: {str(e)}")
