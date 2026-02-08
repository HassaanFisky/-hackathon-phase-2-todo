# REST API Endpoints

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://hackathon-phase-2-todo-gamma.vercel.app`

## Authentication

All endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### List Tasks

```
GET /api/{user_id}/tasks
```

**Query Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| status | string | "all" | Filter: "all", "pending", "completed" |

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "user_id": "user-123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-02-07T10:00:00Z",
    "updated_at": "2026-02-07T10:00:00Z"
  }
]
```

---

### Create Task

```
POST /api/{user_id}/tasks
```

**Request Body:**

```json
{
  "title": "Task title (required, 1-200 chars)",
  "description": "Optional description (max 1000 chars)"
}
```

**Response:** `201 Created`

```json
{
  "id": 2,
  "user_id": "user-123",
  "title": "Task title",
  "description": "Optional description",
  "completed": false,
  "created_at": "2026-02-07T10:00:00Z",
  "updated_at": "2026-02-07T10:00:00Z"
}
```

---

### Get Task

```
GET /api/{user_id}/tasks/{task_id}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-02-07T10:00:00Z",
  "updated_at": "2026-02-07T10:00:00Z"
}
```

---

### Update Task

```
PUT /api/{user_id}/tasks/{task_id}
```

**Request Body:**

```json
{
  "title": "New title (optional)",
  "description": "New description (optional)"
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "New title",
  "description": "New description",
  "completed": false,
  "created_at": "2026-02-07T10:00:00Z",
  "updated_at": "2026-02-07T11:00:00Z"
}
```

---

### Delete Task

```
DELETE /api/{user_id}/tasks/{task_id}
```

**Response:** `204 No Content`

---

### Toggle Completion

```
PATCH /api/{user_id}/tasks/{task_id}/complete
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2026-02-07T10:00:00Z",
  "updated_at": "2026-02-07T12:00:00Z"
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "detail": "Invalid authentication credentials"
}
```

### 403 Forbidden

```json
{
  "detail": "Access denied: cannot access another user's data"
}
```

### 404 Not Found

```json
{
  "detail": "Task {id} not found"
}
```

### 422 Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
