# Phase II: Todo Full-Stack Web Application

**GIAIC Hackathon II Submission**

## Project Overview

A complete full-stack todo application with user authentication and database persistence, built following spec-driven development principles.

## Technology Stack

### Frontend
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth (JWT authentication)

### Backend
- Python FastAPI
- SQLModel (ORM)
- Neon Serverless PostgreSQL
- JWT token verification

## Features

✅ **User Authentication**
- Sign up with email/password
- Secure login with JWT tokens
- User session management

✅ **Task Management (CRUD)**
- Add tasks with title and description
- View all tasks (filtered by status)
- Edit existing tasks
- Delete tasks
- Mark tasks as complete/incomplete

✅ **Advanced Features**
- Status filtering (All/Pending/Completed)
- User data isolation (each user sees only their tasks)
- Responsive design (mobile-friendly)
- Real-time updates
- Persistent storage

## Project Structure

```
hackathon-phase-2-todo/
├── backend/           # Python FastAPI backend
│   ├── main.py       # Application entry point
│   ├── models.py     # Database models
│   ├── routes.py     # API endpoints
│   ├── auth.py       # JWT verification
│   └── database.py   # DB connection
├── frontend/         # Next.js frontend
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   └── lib/          # Utilities (auth, API client)
└── README.md
```

## Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- Neon PostgreSQL account (free tier)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
# Create .env file with DATABASE_URL and BETTER_AUTH_SECRET
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local file with environment variables
npm run dev
```

##API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

- `GET /api/{user_id}/tasks` - List all tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{id}` - Get single task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

## License

MIT License - Educational Project
