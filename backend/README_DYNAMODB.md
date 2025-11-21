# DynamoDB Local Setup

## Overview

FeastFox uses AWS DynamoDB for meal storage. For local development, we use DynamoDB Local running in Docker.

## Architecture

- **DynamoDB Local**: Runs on port 8001 via Docker
- **Backend API**: Connects to DynamoDB Local on startup
- **Data Persistence**: Stored in `.dynamodb/` directory

## Running Locally

### With Devbox Services (Recommended)

```bash
devbox run app:dev
```

This starts:
1. DynamoDB Local (port 8001)
2. Backend API (port 8000)
3. Frontend (port 5173)

### Backend Only

```bash
devbox run app:dev:be
```

Requires DynamoDB Local running separately:
```bash
docker run -p 8001:8000 amazon/dynamodb-local
```

## API Endpoints

### CRUD Operations

**List all meals:**
```bash
GET /api/meals
```

**Get specific meal:**
```bash
GET /api/meals/{meal_id}
```

**Create meal:**
```bash
POST /api/meals
Content-Type: application/json

{
  "meal": "Pizza Margherita",
  "cuisine": "Italian",
  "reason": "Simple and delicious!"
}
```

**Update meal:**
```bash
PUT /api/meals/{meal_id}
Content-Type: application/json

{
  "meal": "Updated Pizza",
  "cuisine": "Italian",
  "reason": "Even better!"
}
```

**Delete meal:**
```bash
DELETE /api/meals/{meal_id}
```

### Legacy Endpoints (Backward Compatible)

- `GET /api/dinner/decision` - Random meal
- `GET /api/dinner/cuisines` - List cuisines
- `GET /api/dinner/meals` - List all meals

## Configuration

Environment variables:
- `DYNAMODB_ENDPOINT` - DynamoDB endpoint (default: http://localhost:8001)
- `AWS_REGION` - AWS region (default: us-east-1)

## Data Initialization

On first startup, the backend automatically:
1. Creates the `feastfox-meals` table
2. Seeds with 5 initial meals

## Testing with curl

```bash
# Create a meal
curl -X POST http://localhost:8000/api/meals \
  -H "Content-Type: application/json" \
  -d '{"meal":"Ramen","cuisine":"Japanese","reason":"Warm and comforting!"}'

# List all meals
curl http://localhost:8000/api/meals

# Get random decision
curl http://localhost:8000/api/dinner/decision
```
