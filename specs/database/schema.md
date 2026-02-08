# Database Schema

## Overview

PostgreSQL database hosted on Neon Serverless, accessed via SQLModel ORM.

## Connection

```
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
```

---

## Tables

### users

Managed by Better Auth on the frontend. Backend references for foreign keys.

| Column        | Type         | Constraints      | Description              |
| ------------- | ------------ | ---------------- | ------------------------ |
| id            | VARCHAR(255) | PRIMARY KEY      | User ID from Better Auth |
| email         | VARCHAR(255) | UNIQUE, NOT NULL | User email               |
| name          | VARCHAR(255) |                  | User display name        |
| password_hash | VARCHAR(255) | NOT NULL         | Hashed password          |
| created_at    | TIMESTAMP    | DEFAULT NOW()    | Account creation time    |
| updated_at    | TIMESTAMP    | DEFAULT NOW()    | Last update time         |

---

### tasks

Core entity for task management.

| Column      | Type         | Constraints                   | Description                 |
| ----------- | ------------ | ----------------------------- | --------------------------- |
| id          | INTEGER      | PRIMARY KEY, AUTO             | Task ID                     |
| user_id     | VARCHAR(255) | FOREIGN KEY → users.id, INDEX | Task owner                  |
| title       | VARCHAR(200) | NOT NULL                      | Task title (1-200 chars)    |
| description | TEXT         |                               | Task description (max 1000) |
| completed   | BOOLEAN      | DEFAULT FALSE, INDEX          | Completion status           |
| created_at  | TIMESTAMP    | DEFAULT NOW()                 | Task creation time          |
| updated_at  | TIMESTAMP    | DEFAULT NOW()                 | Last update time            |

---

## Indexes

| Table | Column(s) | Type   | Purpose           |
| ----- | --------- | ------ | ----------------- |
| users | email     | UNIQUE | Fast email lookup |
| tasks | user_id   | INDEX  | Filter by user    |
| tasks | completed | INDEX  | Filter by status  |

---

## Relationships

```
users (1) ─────< (many) tasks
   │                │
   └──── user_id ───┘
```

---

## SQLModel Definitions

```python
class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    password_hash: str
    created_at: datetime
    updated_at: datetime
    tasks: List["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)
    created_at: datetime
    updated_at: datetime
    user: User = Relationship(back_populates="tasks")
```

---

## Migrations

Tables are automatically created on application startup via:

```python
SQLModel.metadata.create_all(engine)
```

For production schema changes, consider using Alembic migrations.
