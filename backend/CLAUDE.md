# Backend - FastAPI Application

## Overview

Python FastAPI backend with SQLModel ORM, JWT authentication, and PostgreSQL database.

## Tech Stack

- **Framework**: FastAPI
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Auth**: JWT verification via `python-jose`
- **ASGI**: Uvicorn

## Directory Structure

```
backend/
├── main.py           # FastAPI application entry
├── models.py         # SQLModel database models
├── db.py             # Database connection
├── auth.py           # JWT verification
├── routes/           # API route handlers
│   └── tasks.py
├── requirements.txt  # Python dependencies
└── vercel.json       # Vercel deployment config
```

## Commands

```bash
pip install -r requirements.txt        # Install dependencies
uvicorn main:app --reload --port 8000  # Development server
pytest                                  # Run tests
```

## Key Files

### main.py

FastAPI application with CORS, startup hooks, and router registration.

### models.py

SQLModel definitions:

- `User` — User entity (managed by Better Auth)
- `Task` — Task entity with user foreign key
- `TaskCreate`, `TaskUpdate`, `TaskResponse` — Request/response models

### db.py

Database connection using SQLModel engine.

```python
from db import get_session

def my_endpoint(session: Session = Depends(get_session)):
    # Use session for queries
```

### auth.py

JWT verification middleware.

```python
from auth import verify_token

@router.get("/protected")
def protected(user_id: str = Depends(verify_token)):
    # user_id extracted from JWT
```

### routes/tasks.py

All CRUD endpoints for tasks.

## API Endpoints

| Method | Path                               | Description |
| ------ | ---------------------------------- | ----------- |
| GET    | /api/{user_id}/tasks               | List tasks  |
| POST   | /api/{user_id}/tasks               | Create task |
| GET    | /api/{user_id}/tasks/{id}          | Get task    |
| PUT    | /api/{user_id}/tasks/{id}          | Update task |
| DELETE | /api/{user_id}/tasks/{id}          | Delete task |
| PATCH  | /api/{user_id}/tasks/{id}/complete | Toggle      |

## Environment Variables

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET=same-as-frontend
CORS_ORIGINS=http://localhost:3000
```

## Authentication

1. Frontend sends JWT in `Authorization: Bearer <token>` header
2. `verify_token` dependency decodes and validates JWT
3. User ID extracted from `sub` claim
4. All queries filtered by user_id for isolation

## Database

- Uses Neon Serverless PostgreSQL
- Tables auto-created on startup
- Indexed columns: `user_id`, `completed`, `email`

## Deployment

Deployed to Vercel as Python serverless function.

`vercel.json` configures:

- Python runtime
- Build settings
- Route rewrites

## Best Practices

- Use dependency injection for session and auth
- Validate all input with Pydantic models
- Return proper HTTP status codes
- Filter all queries by user_id
- Use indexes for frequently queried columns
