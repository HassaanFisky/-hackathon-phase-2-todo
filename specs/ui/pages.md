# UI Pages

## Overview

All pages in the application with routes and content specifications.

---

## Landing Page

**Route:** `/`

**Purpose:** Welcome visitors and encourage signup/login.

**Content:**

- Hero section with value proposition
- Feature highlights (3-6 items)
- Tech stack badges
- CTA buttons (Login, Signup)

**States:**

- Default (not logged in)
- Logged in (redirects or shows dashboard link)

---

## Login Page

**Route:** `/login`

**Purpose:** Authenticate returning users.

**Content:**

- Header with icon and welcome message
- Email input field
- Password input field
- Login button
- Error messages
- Link to signup page
- Google OAuth button (optional)

**States:**

- Default
- Loading (during auth)
- Error (invalid credentials)

---

## Signup Page

**Route:** `/signup`

**Purpose:** Register new users.

**Content:**

- Header with icon and encouraging message
- Name input field
- Email input field
- Password input field with strength indicator
- Signup button
- Error messages
- Link to login page
- Google OAuth button (optional)

**States:**

- Default
- Loading (during registration)
- Error (validation or server)

---

## Dashboard Page

**Route:** `/dashboard`

**Purpose:** Main task management interface.

**Layout:**

```
┌─────────────────────────────────────────────────┐
│  Header: Logo | Task Count | Logout             │
├─────────────────────────────────────────────────┤
│  Add Task Form                                  │
│  ┌───────────────────────────────────────────┐ │
│  │ Title input                                │ │
│  │ Description textarea                       │ │
│  │ Add Task button                            │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  Filter Tabs: All | Pending | Completed         │
├─────────────────────────────────────────────────┤
│  Task List                                      │
│  ┌───────────────────────────────────────────┐ │
│  │ □ Task 1 title                    ✎ 🗑    │ │
│  │   Description...                          │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │ ✓ Task 2 title (completed)        ✎ 🗑    │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Content:**

- Glassmorphic header with stats
- Add task form with character counters
- Filter tabs (All, Pending, Completed)
- Task list with cards
- Empty state when no tasks
- Loading state while fetching

**States:**

- Loading
- Empty (no tasks)
- With tasks
- Editing task (inline)
- Error

---

## Common Elements

### Navigation

- Protected routes redirect to login
- After login, redirect to dashboard

### Error Handling

- Toast notifications for actions
- Inline error messages for forms
- 401 redirects to login

### Responsive Design

- Mobile: Single column, full-width cards
- Tablet: Comfortable padding
- Desktop: Max-width container, centered

### Dark Mode

- All pages support dark mode
- Toggle in header (future)
- Respects system preference

---

## Page Flow

```
Landing (/)
    ↓
Login (/login) ←→ Signup (/signup)
    ↓
Dashboard (/dashboard)
    ↓
Logout → Landing
```
