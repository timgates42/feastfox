"""
FeastFox Backend API
The clever dinner decider app backend
"""
import random
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# Pydantic Models
class DinnerDecision(BaseModel):
    """Response model for dinner decision"""
    meal: str
    cuisine: str
    reason: str


# FastAPI Application
app = FastAPI(
    title="FeastFox API",
    description="The clever dinner decider app backend",
    version="1.0.0",
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Meal Database
MEALS: List[DinnerDecision] = [
    DinnerDecision(
        meal="Spaghetti Carbonara",
        cuisine="Italian",
        reason="Classic comfort food that never disappoints!",
    ),
    DinnerDecision(
        meal="Chicken Tikka Masala",
        cuisine="Indian",
        reason="Spicy and flavourful, perfect for an adventure!",
    ),
    DinnerDecision(
        meal="Tacos al Pastor",
        cuisine="Mexican",
        reason="Fresh and vibrant flavours for a festive evening!",
    ),
    DinnerDecision(
        meal="Pad Thai",
        cuisine="Thai",
        reason="Sweet, sour, and satisfying all at once!",
    ),
    DinnerDecision(
        meal="Salmon Teriyaki",
        cuisine="Japanese",
        reason="Healthy and delicious with a perfect glaze!",
    ),
    DinnerDecision(
        meal="Greek Moussaka",
        cuisine="Greek",
        reason="Hearty and Mediterranean, a true delight!",
    ),
    DinnerDecision(
        meal="Beef Pho",
        cuisine="Vietnamese",
        reason="Aromatic and warming, perfect for any mood!",
    ),
    DinnerDecision(
        meal="Fish and Chips",
        cuisine="British",
        reason="Crispy and classic, a timeless favourite!",
    ),
    DinnerDecision(
        meal="Beef Bourguignon",
        cuisine="French",
        reason="Rich and elegant, perfect for a special evening!",
    ),
    DinnerDecision(
        meal="Butter Chicken",
        cuisine="Indian",
        reason="Creamy and comforting with aromatic spices!",
    ),
]


# API Endpoints
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "FeastFox API",
        "version": "1.0.0",
        "description": "The clever dinner decider app backend",
        "endpoints": {
            "health": "/health",
            "dinner_decision": "/api/dinner/decision",
            "docs": "/docs",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "feastfox-backend"}


@app.get("/api/dinner/decision", response_model=DinnerDecision)
async def get_dinner_decision() -> DinnerDecision:
    """
    Get a random dinner decision
    
    Returns a random meal suggestion with cuisine type and reason
    """
    try:
        decision = random.choice(MEALS)
        return decision
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate dinner decision: {str(e)}",
        )


@app.get("/api/dinner/cuisines")
async def get_available_cuisines():
    """Get list of available cuisines"""
    cuisines = list(set(meal.cuisine for meal in MEALS))
    return {"cuisines": sorted(cuisines), "count": len(cuisines)}


@app.get("/api/dinner/meals")
async def get_all_meals():
    """Get all available meals"""
    return {"meals": MEALS, "count": len(MEALS)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
