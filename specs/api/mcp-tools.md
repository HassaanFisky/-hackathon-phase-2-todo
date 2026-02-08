# MCP Tools

## Overview

Model Context Protocol (MCP) tools for Phase III AI chatbot integration.

## Status

**Not yet implemented** — Planned for Phase III.

## Planned Tools

### list_tasks

List all tasks for the authenticated user.

**Parameters:**

- `status` (optional): "all" | "pending" | "completed"

**Returns:** Array of task objects

---

### create_task

Create a new task.

**Parameters:**

- `title` (required): Task title
- `description` (optional): Task description

**Returns:** Created task object

---

### update_task

Update an existing task.

**Parameters:**

- `task_id` (required): Task ID
- `title` (optional): New title
- `description` (optional): New description

**Returns:** Updated task object

---

### delete_task

Delete a task.

**Parameters:**

- `task_id` (required): Task ID

**Returns:** Confirmation message

---

### toggle_complete

Toggle task completion status.

**Parameters:**

- `task_id` (required): Task ID

**Returns:** Updated task object

---

## Authentication

All MCP tools receive the authenticated user's context and operate within their data scope.

## See Also

- `specs/features/chatbot.md` — Chatbot feature specification
