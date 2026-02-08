# Todo Full-Stack Application

## Project Overview

A modern multi-user todo application built for GIAIC Hackathon II, demonstrating full-stack development with authentication, persistent storage, and a polished user interface.

## Technology Stack

### Frontend

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth with JWT

### Backend

- **Framework**: FastAPI (Python)
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT verification

## Project Structure

```
hackathon-todo/
├── .spec-kit/          # Spec-Kit configuration
├── specs/              # All specification files
├── frontend/           # Next.js application
├── backend/            # FastAPI application
├── docker-compose.yml  # Local development
└── README.md           # Setup instructions
```

## Key Features

1. **User Authentication** — Secure signup/login with JWT
2. **Task CRUD** — Create, read, update, delete tasks
3. **Task Completion** — Mark tasks as complete/incomplete
4. **User Isolation** — Each user sees only their tasks
5. **Responsive UI** — Works on all device sizes

## Phases

- **Phase I**: Console application (in-memory)
- **Phase II**: Full-stack web application (current)
- **Phase III**: AI chatbot integration (future)
