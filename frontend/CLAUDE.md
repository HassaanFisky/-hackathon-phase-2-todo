# Frontend - Next.js Application

## Overview

Modern Next.js 16+ application with App Router, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Auth**: Better Auth client library
- **API**: Fetch with typed responses

## Directory Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── api/auth/[...all]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── api-client.ts
│   └── auth.ts
├── components/         # Shared components (to be added)
└── tailwind.config.ts
```

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server (port 3000)
npm run build        # Production build
npm run lint         # Run ESLint
```

## Key Files

### lib/api-client.ts

Centralized API client with JWT handling. All backend calls go through this.

```typescript
const api = new ApiClient();
api.setToken(token);
const tasks = await api.getTasks(userId);
```

### lib/auth.ts

Better Auth configuration with Google OAuth.

### app/(auth)/\*

Authentication pages (login, signup) with form handling.

### app/dashboard/page.tsx

Main task management interface with CRUD operations.

## Authentication Flow

1. User lands on `/login` or `/signup`
2. Submits credentials to Better Auth endpoints
3. JWT stored in localStorage
4. All API requests include `Authorization: Bearer <token>`
5. 401 responses redirect to login

## Styling Patterns

- Custom CSS variables for design tokens
- Tailwind utilities with custom extensions
- Glassmorphism for cards and panels
- Smooth transitions (300ms default)
- 8px grid system

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Best Practices

- Use `'use client'` directive for client components
- Prefer server components when possible
- Centralize API calls in `lib/api-client.ts`
- Use TypeScript interfaces for all data
- Handle loading and error states
