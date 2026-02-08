# Todo Full-Stack Application

## Project Overview

GIAIC Hackathon II submission - a modern multi-user todo application demonstrating full-stack development with authentication, persistent storage, and a polished user interface.

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- Neon PostgreSQL account (or local PostgreSQL)

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Using Docker

```bash
docker-compose up
```

## Project Structure

```
hackathon-todo/
├── specs/              # All specifications
│   ├── overview.md
│   ├── architecture.md
│   ├── features/       # Feature specs
│   ├── api/            # API documentation
│   ├── database/       # Schema docs
│   └── ui/             # UI/UX specs
├── frontend/           # Next.js application
├── backend/            # FastAPI application
└── docker-compose.yml  # Local development
```

## Commands

### Frontend

- `npm run dev` — Development server (port 3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint

### Backend

- `uvicorn main:app --reload` — Dev server (port 8000)
- `pytest` — Run tests

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret
DATABASE_URL=postgresql://...
```

### Backend (.env)

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=same-secret-as-frontend
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Phases

- **Phase I**: Console app (in-memory storage)
- **Phase II**: Web app (current - PostgreSQL, JWT auth)
- **Phase III**: AI chatbot (future - MCP integration)

## See Also

- `specs/overview.md` — Full feature overview
- `specs/architecture.md` — System architecture
- `specs/api/rest-endpoints.md` — API reference
