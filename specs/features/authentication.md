# Feature: Authentication

## Overview

User authentication system using Better Auth with JWT tokens for secure API access.

## User Stories

### Sign Up

**As a** new user  
**I want to** create an account  
**So that** I can start managing my tasks

**Acceptance Criteria:**

- Required: name, email, password
- Email must be unique
- Password minimum 8 characters
- Password strength indicator shown
- Automatic login after signup
- Redirect to dashboard

### Sign In

**As a** returning user  
**I want to** log in to my account  
**So that** I can access my tasks

**Acceptance Criteria:**

- Required: email, password
- Clear error messages on failure
- Remember me option (optional)
- Redirect to dashboard on success

### Sign Out

**As a** user  
**I want to** log out  
**So that** I can secure my session

**Acceptance Criteria:**

- Clears local session and token
- Redirects to landing page
- Requires re-authentication for protected pages

### Google OAuth (Optional)

**As a** user  
**I want to** sign in with Google  
**So that** I can use my existing account

**Acceptance Criteria:**

- Button clearly labeled
- Redirects to Google consent
- Creates or links user account
- Same session handling as email login

## Technical Implementation

### Frontend

- Better Auth client integration
- JWT stored in localStorage
- Token attached to all API requests
- Protected route handling
- Automatic redirect on 401

### Backend

- JWT verification middleware
- BETTER_AUTH_SECRET shared with frontend
- User ID extracted from token `sub` claim
- User isolation enforced on all queries

### Token Flow

1. User authenticates via Better Auth
2. JWT generated with user ID in `sub` claim
3. Token includes 7-day expiry
4. Frontend includes token in Authorization header
5. Backend verifies signature and extracts user ID
6. All data operations filtered by user ID

### Security

- HTTPS required in production
- Token stored in localStorage
- Password hashed by Better Auth
- CORS configured for frontend origin
