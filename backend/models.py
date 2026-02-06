"""
Database models using SQLModel (SQLAlchemy + Pydantic)
Implements the exact schema from Hackathon II Phase II specification.
"""

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime


class User(SQLModel, table=True):
    """
    User model - managed by Better Auth on frontend
    Backend only needs to reference user_id for task filtering
    """
    __tablename__ = "users"
    
    # Primary key - string ID from Better Auth
    id: str = Field(primary_key=True, max_length=255)
    
    # User credentials and profile
    email: str = Field(unique=True, index=True, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    password_hash: str = Field(max_length=255)  # Hashed by Better Auth
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    tasks: List["Task"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    """
    Task model - core entity for Phase II
    Implements all 5 Basic Level features: Add, Delete, Update, View, Mark Complete
    """
    __tablename__ = "tasks"
    
    # Primary key - auto-incrementing integer
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Foreign key to user - enforces user isolation
    user_id: str = Field(
        foreign_key="users.id", 
        index=True,  # Index for fast filtering by user
        max_length=255
    )
    
    # Task content
    title: str = Field(min_length=1, max_length=200)  # Required, 1-200 chars
    description: Optional[str] = Field(default=None, max_length=1000)  # Optional, max 1000
    
    # Task status
    completed: bool = Field(default=False, index=True)  # Index for status filtering
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="tasks")


# Request/Response Models for API

class TaskCreate(SQLModel):
    """Request model for creating a new task"""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class TaskUpdate(SQLModel):
    """Request model for updating a task"""
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class TaskResponse(SQLModel):
    """Response model for task data"""
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
