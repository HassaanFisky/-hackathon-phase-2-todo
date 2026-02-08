# The Evolution of Todo - Walkthrough

Welcome to the **Evolution of Todo**! This document provides a tour of the codebase, explaining how the different parts work together to deliver a premium, full-stack application.

## 🚀 Quick Start

1.  **Prerequisites**: Node.js 18+, Python 3.10+, Docker (optional).
2.  **Environment Setup**:
    - Frontend: Copy `.env.example` to `.env.local` and add your `BETTER_AUTH_SECRET` and Google OAuth credentials.
    - Backend: Copy `.env.example` to `.env` and add your `DATABASE_URL` (Neon PostgreSQL) and the _same_ `BETTER_AUTH_SECRET`.
3.  **Run Locally**:
    - Backend: `cd backend && uvicorn main:app --reload`
    - Frontend: `cd frontend && npm run dev`
4.  **Access**: Open `http://localhost:3000`.

## 📂 Project Structure

### Root Directory

- `specs/`: Detailed technical specifications (Architecture, API, Schema, etc.).
- `phase-1-console/`: The original CLI version of the app (Reference).
- `docker-compose.yml`: For running the entire stack in containers.

### Frontend (`/frontend`)

Built with **Next.js 15**, **Tailwind CSS**, and **Better Auth**.

- `app/page.tsx`: The premium Landing Page with glassmorphic design and animations.
- `app/dashboard/page.tsx`: The main Task Management interface.
  - Uses `useEffect` to protect routes.
  - Fetches data from the Python backend.
- `app/api/auth/[...all]/route.ts`: API handler for Better Auth (Google Sign-In).
- `lib/api-client.ts`: A centralized HTTP client for interacting with the backend.

### Backend (`/backend`)

Built with **FastAPI**, **SQLModel**, and **Python**.

- `main.py`: The entry point. Configures CORS and database.
- `models.py`: Database models (`User`, `Task`) and Pydantic schemas.
- `auth.py`: Handles JWT verification. It ensures strict data isolation (users can only access their own tasks).
- `routes/tasks.py`: Implements CRUD operations (Create, Read, Update, Delete).
- `db.py`: Database connection logic (Neon PostgreSQL).

## 🔐 Authentication Config

We use **Better Auth** for a modern, secure authentication flow.

- **Users** sign in via Google (or Email).
- **Frontend** receives a JWT.
- **Backend** verifies this JWT using the shared `BETTER_AUTH_SECRET`.

## 🛠️ Key Design Drivers

- **Spec-Driven**: Every feature was built according to the specs in `specs/`.
- **Premium UI**: Glassmorphism, gradients, and micro-interactions.
- **Separation of Concerns**: Strict boundary between Frontend (UI) and Backend (Logic).

## 📜 Phase 1 Archive

The original console-based application is preserved in `phase-1-console/` to demonstrate the evolution from a simple script to a cloud-native web app.
