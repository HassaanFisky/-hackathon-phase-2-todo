# Feature: Task CRUD Operations

## Overview

Core task management functionality allowing users to create, read, update, and delete tasks.

## User Stories

### Add Task

**As a** user  
**I want to** create a new task with title and description  
**So that** I can track what needs to be done

**Acceptance Criteria:**

- Title is required (1-200 characters)
- Description is optional (max 1000 characters)
- New tasks default to incomplete status
- Task is associated with authenticated user
- Timestamps are automatically set

### View Tasks

**As a** user  
**I want to** see all my tasks  
**So that** I can review what needs to be done

**Acceptance Criteria:**

- Shows only tasks belonging to authenticated user
- Displays title, description, and completion status
- Can filter by: all, pending, completed
- Ordered by creation date (newest first)
- Status indicators: ✓ complete, ○ pending

### Update Task

**As a** user  
**I want to** edit my task details  
**So that** I can correct or update information

**Acceptance Criteria:**

- Can update title and/or description
- Updated timestamp is automatically set
- Only task owner can update

### Delete Task

**As a** user  
**I want to** remove a task  
**So that** I can keep my list clean

**Acceptance Criteria:**

- Confirmation required before deletion
- Only task owner can delete
- Task is permanently removed

### Toggle Completion

**As a** user  
**I want to** mark tasks as complete or incomplete  
**So that** I can track my progress

**Acceptance Criteria:**

- Single click/tap toggles status
- Visual feedback on status change
- Updated timestamp is set

## Technical Implementation

### API Endpoints

- `GET /api/{user_id}/tasks` — List tasks
- `POST /api/{user_id}/tasks` — Create task
- `GET /api/{user_id}/tasks/{id}` — Get task
- `PUT /api/{user_id}/tasks/{id}` — Update task
- `DELETE /api/{user_id}/tasks/{id}` — Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` — Toggle

### Database

- Table: `tasks`
- Indexed on: `user_id`, `completed`

### Frontend Components

- `TaskCard` — Individual task display
- `TaskList` — Collection of tasks
- `AddTaskForm` — Task creation form
- `TaskActions` — Edit/delete controls
