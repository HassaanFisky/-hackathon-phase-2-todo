# System Architecture

## Overview

The application follows a decoupled architecture with separate frontend and backend services, communicating via REST API over HTTPS.

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend (Vercel)                   │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │
│  │  │ Landing │  │  Auth   │  │Dashboard│  │  API    │    │   │
│  │  │  Page   │  │ Pages   │  │  Page   │  │ Client  │    │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └────┬────┘    │   │
│  │                                              │          │   │
│  │  ┌─────────────────────────────────────────┐│          │   │
│  │  │        Better Auth (Session + JWT)       ││          │   │
│  │  └─────────────────────────────────────────┘│          │   │
│  └──────────────────────────────────────────────┼──────────┘   │
└─────────────────────────────────────────────────┼───────────────┘
                                                  │
                                         Authorization: Bearer <JWT>
                                                  │
┌─────────────────────────────────────────────────┼───────────────┐
│                          SERVER                  │               │
│  ┌──────────────────────────────────────────────┼────────────┐  │
│  │              FastAPI Backend (Vercel)         │            │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐       │            │  │
│  │  │  Main   │  │  Auth   │  │ Routes  │◄──────┘            │  │
│  │  │   App   │  │Middleware│  │         │                    │  │
│  │  └─────────┘  └─────────┘  └────┬────┘                    │  │
│  │                                  │                         │  │
│  │  ┌─────────────────────────────┐│                         │  │
│  │  │      SQLModel + Models       ││                         │  │
│  │  └─────────────────────────────┘│                         │  │
│  └──────────────────────────────────┼─────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Neon PostgreSQL                              │
│                   (Serverless Database)                          │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

1. User submits credentials on frontend
2. Better Auth validates and creates session
3. JWT token generated with user ID in `sub` claim
4. Frontend stores token and attaches to API requests
5. Backend verifies JWT using shared `BETTER_AUTH_SECRET`
6. User ID extracted from token for data isolation

## Data Flow

1. **Read**: Frontend → API Client → Backend → Database → Response
2. **Write**: Frontend → API Client → Backend → Validate → Database → Response
3. **Auth**: All requests include JWT in Authorization header
4. **Isolation**: Backend filters all queries by user_id from token

## Security Layers

1. **Transport**: HTTPS everywhere
2. **Authentication**: JWT with 7-day expiry
3. **Authorization**: User ID matching on every request
4. **Validation**: Pydantic models on input
5. **Isolation**: Foreign key constraints on user_id
