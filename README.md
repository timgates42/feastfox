# 🦊 FeastFox

The clever dinner decider app! Never wonder what to eat again.

## Overview

FeastFox is a full-stack application that helps you decide what to have for dinner. Built with modern technologies and managed with devbox for reproducible development environments.

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for blazing fast builds
- NextUI (HeroUI) component library
- TanStack Query for data fetching
- Tailwind CSS for styling

**Backend:**
- Python 3.11
- FastAPI for REST API
- Pydantic for data validation
- Uvicorn ASGI server

**Development:**
- Devbox for reproducible environments
- Service orchestration with devbox services

## Prerequisites

- [Devbox](https://www.jetify.com/devbox) installed on your system

## Quick Start

### 1. Clone and Enter Devbox Shell

```bash
git clone <repository-url>
cd feastfox
devbox shell
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && pip install -r requirements.txt && cd ..
```

Or use the devbox script:
```bash
devbox run setup
```

### 3. Run the Application

**Option A: Run Both Services Together**
```bash
devbox services up
```

**Option B: Run Services Separately**

Terminal 1 (Frontend with mocks):
```bash
cd frontend
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Development Modes

### Mock Mode (Default)

The frontend runs with mock data by default. Perfect for frontend development without needing the backend.

- Set in `.env.development`: `VITE_USE_MOCK=true`
- Shows a "🎭 Mock Mode" badge in the UI

### Integrated Mode

Connect the frontend to the live backend API.

1. Start the backend service
2. Update frontend environment:
   ```bash
   # In frontend/.env.development
   VITE_USE_MOCK=false
   ```
3. Restart the frontend
4. UI will show "🌐 Connected to API" badge

## Project Structure

```
feastfox/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API and mock services
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Main app component
│   ├── .env.development   # Development environment variables
│   └── package.json
├── backend/               # FastAPI backend
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Backend environment variables
├── devbox.json           # Devbox configuration
└── README.md
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Get Dinner Decision
```bash
GET /api/dinner/decision

Response:
{
  "meal": "Spaghetti Carbonara",
  "cuisine": "Italian",
  "reason": "Classic comfort food that never disappoints!"
}
```

### Get Available Cuisines
```bash
GET /api/dinner/cuisines
```

### Get All Meals
```bash
GET /api/dinner/meals
```

## Development Commands

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
cd backend
python -m uvicorn main:app --reload              # Start with auto-reload
python -m uvicorn main:app --host 0.0.0.0       # Expose on network
```

### Devbox
```bash
devbox shell              # Enter devbox environment
devbox services up        # Start all services
devbox services stop      # Stop all services
devbox run setup          # Install all dependencies
```

## Environment Variables

### Frontend (.env.development)
- `VITE_USE_MOCK` - Use mock data (true/false)
- `VITE_API_URL` - Backend API URL (default: http://localhost:8000)

### Backend (.env)
- `PORT` - Server port (default: 8000)
- `HOST` - Server host (default: 0.0.0.0)

## Troubleshooting

### Port Already in Use

If you see "address already in use" errors:

```bash
# Find and kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Find and kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9
```

### Dependencies Not Found

Ensure you're in the devbox shell:
```bash
devbox shell
```

Then reinstall dependencies:
```bash
devbox run setup
```

### Frontend Can't Connect to Backend

1. Verify backend is running: `curl http://localhost:8000/health`
2. Check CORS settings in `backend/main.py`
3. Ensure `VITE_USE_MOCK=false` in frontend environment
4. Check browser console for errors

## Contributing

1. Make changes in a feature branch
2. Test both mock and integrated modes
3. Ensure all services start with `devbox services up`
4. Submit a pull request

## License

See LICENSE file for details.
