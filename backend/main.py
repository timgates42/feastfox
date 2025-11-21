"""
FeastFox Backend API
The clever dinner decider app backend
"""
import os
import random
from typing import List
from uuid import uuid4

import boto3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# Pydantic Models
class MealBase(BaseModel):
    """Base model for meal"""
    meal: str
    cuisine: str
    reason: str


class MealCreate(MealBase):
    """Model for creating a meal"""
    pass


class Meal(MealBase):
    """Response model for meal with ID"""
    id: str


class DinnerDecision(MealBase):
    """Response model for dinner decision (backward compatibility)"""
    pass


# DynamoDB Configuration
DYNAMODB_ENDPOINT = os.getenv("DYNAMODB_ENDPOINT", "http://localhost:8001")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
TABLE_NAME = "feastfox-meals"

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=DYNAMODB_ENDPOINT,
    region_name=AWS_REGION,
    aws_access_key_id="dummy",
    aws_secret_access_key="dummy",
)


def init_dynamodb():
    """Initialize DynamoDB table"""
    try:
        table = dynamodb.create_table(
            TableName=TABLE_NAME,
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST",
        )
        table.wait_until_exists()
        
        # Seed initial data
        initial_meals = [
            {"meal": "Spaghetti Carbonara", "cuisine": "Italian", "reason": "Classic comfort food that never disappoints!"},
            {"meal": "Chicken Tikka Masala", "cuisine": "Indian", "reason": "Spicy and flavourful, perfect for an adventure!"},
            {"meal": "Tacos al Pastor", "cuisine": "Mexican", "reason": "Fresh and vibrant flavours for a festive evening!"},
            {"meal": "Pad Thai", "cuisine": "Thai", "reason": "Sweet, sour, and satisfying all at once!"},
            {"meal": "Salmon Teriyaki", "cuisine": "Japanese", "reason": "Healthy and delicious with a perfect glaze!"},
        ]
        
        for meal_data in initial_meals:
            table.put_item(Item={"id": str(uuid4()), **meal_data})
    except dynamodb.meta.client.exceptions.ResourceInUseException:
        pass  # Table already exists


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
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize DynamoDB on startup"""
    init_dynamodb()


# Helper Functions
def get_table():
    """Get DynamoDB table"""
    return dynamodb.Table(TABLE_NAME)


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
            "meals": "/api/meals",
            "docs": "/docs",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "feastfox-backend"}


@app.get("/api/dinner/decision", response_model=DinnerDecision)
async def get_dinner_decision() -> DinnerDecision:
    """Get a random dinner decision"""
    table = get_table()
    response = table.scan()
    meals = response.get("Items", [])
    
    if not meals:
        raise HTTPException(status_code=404, detail="No meals available")
    
    meal = random.choice(meals)
    return DinnerDecision(**meal)


@app.get("/api/dinner/cuisines")
async def get_available_cuisines():
    """Get list of available cuisines"""
    table = get_table()
    response = table.scan()
    meals = response.get("Items", [])
    cuisines = list(set(meal["cuisine"] for meal in meals))
    return {"cuisines": sorted(cuisines), "count": len(cuisines)}


@app.get("/api/dinner/meals")
async def get_all_meals():
    """Get all available meals (backward compatibility)"""
    table = get_table()
    response = table.scan()
    meals = response.get("Items", [])
    return {"meals": meals, "count": len(meals)}


# CRUD Endpoints
@app.get("/api/meals", response_model=List[Meal])
async def list_meals():
    """List all meals"""
    table = get_table()
    response = table.scan()
    return response.get("Items", [])


@app.get("/api/meals/{meal_id}", response_model=Meal)
async def get_meal(meal_id: str):
    """Get a specific meal by ID"""
    table = get_table()
    response = table.get_item(Key={"id": meal_id})
    
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    return response["Item"]


@app.post("/api/meals", response_model=Meal, status_code=201)
async def create_meal(meal: MealCreate):
    """Create a new meal"""
    table = get_table()
    meal_id = str(uuid4())
    item = {"id": meal_id, **meal.model_dump()}
    
    table.put_item(Item=item)
    return item


@app.put("/api/meals/{meal_id}", response_model=Meal)
async def update_meal(meal_id: str, meal: MealCreate):
    """Update an existing meal"""
    table = get_table()
    
    # Check if meal exists
    response = table.get_item(Key={"id": meal_id})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    item = {"id": meal_id, **meal.model_dump()}
    table.put_item(Item=item)
    return item


@app.delete("/api/meals/{meal_id}", status_code=204)
async def delete_meal(meal_id: str):
    """Delete a meal"""
    table = get_table()
    
    # Check if meal exists
    response = table.get_item(Key={"id": meal_id})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    table.delete_item(Key={"id": meal_id})
    return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
