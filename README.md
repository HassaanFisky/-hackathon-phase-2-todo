# Todo Full-Stack Application

GIAIC Hackathon II submission — A modern, multi-user todo application demonstrating full-stack development with authentication, persistent storage, and a polished user interface.

![Phase II](https://img.shields.io/badge/Phase-II-blue)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016+-black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![PostgreSQL](https://img.shields.io/badge/Database-Neon%20PostgreSQL-blue)

---

## 🌟 Features

- **User Authentication** — Secure signup/login with JWT tokens
- **Google OAuth** — Optional one-click sign in
- **Task Management** — Full CRUD operations
- **Task Completion** — Mark tasks complete/incomplete
- **User Isolation** — Each user sees only their tasks
- **Premium UI** — Glassmorphic design with smooth animations
- **Responsive** — Works on all device sizes

---

## 🏗️ Project Structure

```
hackathon-todo/
├── .spec-kit/              # Spec-Kit configuration
│   └── config.yaml
├── specs/                  # Specifications
│   ├── overview.md
│   ├── architecture.md
│   ├── features/
│   │   ├── task-crud.md
│   │   ├── authentication.md
│   │   └── chatbot.md
│   ├── api/
│   │   ├── rest-endpoints.md
│   │   └── mcp-tools.md
│   ├── database/
│   │   └── schema.md
│   └── ui/
│       ├── components.md
│       └── pages.md
├── frontend/               # Next.js application
│   ├── app/
│   ├── lib/
│   ├── CLAUDE.md
│   └── package.json
├── backend/                # FastAPI application
│   ├── routes/
│   ├── main.py
│   ├── models.py
│   ├── db.py
│   ├── auth.py
│   ├── CLAUDE.md
│   └── requirements.txt
├── docker-compose.yml      # Local development
├── CLAUDE.md               # Project guide
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- Neon PostgreSQL account (or local PostgreSQL)

### 1. Clone Repository

```bash
git clone <repository-url>
cd hackathon-todo
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your DATABASE_URL and BETTER_AUTH_SECRET
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 4. Run Applications

**Backend:**

```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm run dev
```

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🐳 Docker Development

```bash
# Start all services
docker-compose up

# Stop services
docker-compose down
```

---

## 🔧 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-32-character-secret
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

### Backend (.env)

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET=same-secret-as-frontend
CORS_ORIGINS=http://localhost:3000
```

---

## 📚 API Endpoints

| Method | Endpoint                             | Description       |
| ------ | ------------------------------------ | ----------------- |
| GET    | `/api/{user_id}/tasks`               | List all tasks    |
| POST   | `/api/{user_id}/tasks`               | Create a task     |
| GET    | `/api/{user_id}/tasks/{id}`          | Get a task        |
| PUT    | `/api/{user_id}/tasks/{id}`          | Update a task     |
| DELETE | `/api/{user_id}/tasks/{id}`          | Delete a task     |
| PATCH  | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

See [API Documentation](specs/api/rest-endpoints.md) for details.

---

## 📋 Phases

| Phase | Description                | Status      |
| ----- | -------------------------- | ----------- |
| I     | Console Application        | ✅ Complete |
| II    | Full-Stack Web Application | ✅ Complete |
| III   | AI Chatbot Integration     | 🔜 Planned  |

---

## 📖 Documentation

- [Project Overview](specs/overview.md)
- [Architecture](specs/architecture.md)
- [API Reference](specs/api/rest-endpoints.md)
- [Database Schema](specs/database/schema.md)
- [UI Components](specs/ui/components.md)

---

## 🛠️ Technologies

**Frontend:**

- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth

**Backend:**

- FastAPI
- SQLModel
- Python 3.10+

**Database:**

- Neon Serverless PostgreSQL

**Deployment:**

- Vercel (Frontend + Backend)

---

## 👨‍💻 Development

```bash
# Run frontend in development
cd frontend && npm run dev

# Run backend in development
cd backend && uvicorn main:app --reload

# Run linting
cd frontend && npm run lint

# Build frontend for production
cd frontend && npm run build
```

---

## 📄 License

MIT License - Built for GIAIC Hackathon II
