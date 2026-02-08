"""
API route handlers for task management
Implements all Phase II required endpoints from specification
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import Task, TaskCreate, TaskUpdate, TaskResponse
from db import get_session
from auth import verify_token, verify_user_access

# Create API router
router = APIRouter()


# ============================================================================
# ENDPOINT 1: GET /api/{user_id}/tasks - List all tasks
# ============================================================================

@router.get("/api/{user_id}/tasks", response_model=List[TaskResponse])
async def list_tasks(
    user_id: str,
    status_filter: Optional[str] = "all",  # Query param: all, pending, completed
    session: Session = Depends(get_session),
    token_user_id: str = Depends(verify_token)
):
    """
    List all tasks for authenticated user
    
    Query Parameters:
        - status: Filter by completion status
          - "all" (default): All tasks
          - "pending": Only incomplete tasks (completed=False)
          - "completed": Only complete tasks (completed=True)
    
    Returns:
        List of tasks matching filter, ordered by creation date (newest first)
    
    Security:
        - Requires valid JWT token
        - Only returns tasks belonging to authenticated user
    """
    # Verify user can access this user_id
    verify_user_access(token_user_id, user_id)
    
    # Build query - always filter by user_id
    query = select(Task).where(Task.user_id == user_id)
    
    # Apply status filter if specified
    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)
    # "all" or invalid values: no additional filter
    
    # Order by creation date descending (newest first)
    query = query.order_by(Task.created_at.desc())
    
    # Execute query and return results
    tasks = session.exec(query).all()
    return tasks


# ============================================================================
# ENDPOINT 2: POST /api/{user_id}/tasks - Create a new task
# ============================================================================

@router.post(
    "/api/{user_id}/tasks", 
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_task(
    user_id: str,
    task_data: TaskCreate,  # Request body validated by Pydantic
    session: Session = Depends(get_session),
    token_user_id: str = Depends(verify_token)
):
    """
    Create a new task for authenticated user
    
    Request Body:
        {
            "title": "Task title (required, 1-200 chars)",
            "description": "Optional description (max 1000 chars)"
        }
    
    Returns:
        Created task with generated ID and timestamps
    
    Security:
        - Requires valid JWT token
        - Task automatically associated with authenticated user
    """
    # Verify user can access this user_id
    verify_user_access(token_user_id, user_id)
    
    # Create new task instance
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        completed=False,  # New tasks always start incomplete
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    # Save to database
    session.add(task)
    session.commit()
    session.refresh(task)  # Get generated ID and timestamps
    
    return task


# ============================================================================
# ENDPOINT 3: GET /api/{user_id}/tasks/{task_id} - Get single task
# ============================================================================

@router.get("/api/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    token_user_id: str = Depends(verify_token)
):
    """
    Get details of a specific task
    
    Returns:
        Task data if found and belongs to authenticated user
    
    Raises:
        404: Task not found or doesn't belong to user
    
    Security:
        - Requires valid JWT token
        - Only returns task if it belongs to authenticated user
    """
    # Verify user can access this user_id
    verify_user_access(token_user_id, user_id)
    
    # Get task by ID
    task = session.get(Task, task_id)
    
    # Verify task exists and belongs to user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )
    
    return task


# ============================================================================
# ENDPOINT 4: PUT /api/{user_id}/tasks/{task_id} - Update task
# ============================================================================

@router.put("/api/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,  # Partial update model
    session: Session = Depends(get_session),
    token_user_id: str = Depends(verify_token)
):
    """
    Update task title and/or description
    
    Request Body:
        {
            "title": "New title (optional)",
            "description": "New description (optional)"
        }
    
    Only provided fields will be updated
    
    Returns:
        Updated task data
    
    Raises:
        404: Task not found or doesn't belong to user
    
    Security:
        - Requires valid JWT token
        - Can only update own tasks
    """
    # Verify user can access this user_id
    verify_user_access(token_user_id, user_id)
    
    # Get task by ID
    task = session.get(Task, task_id)
    
    # Verify task exists and belongs to user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )
    
    # Update only provided fields
    if task_data.title is not None:
        task.title = task_data.title
    
    if task_data.description is not None:
        task.description = task_data.description
    
    # Update timestamp
    task.updated_at = datetime.utcnow()
    
    # Save changes
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task


# ============================================================================
# ENDPOINT 5: DELETE /api/{user_id}/tasks/{task_id} - Delete task
# ============================================================================

@router.delete(
    "/api/{user_id}/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    token_user_id: str = Depends(verify_token)
):
    """
    Delete a task
    
    Returns:
        204 No Content on success
    
    Raises:
        404: Task not found or doesn't belong to user
    
    Security:
        - Requires valid JWT token
        - Can only delete own tasks
    """
    # Verify user can access this user_id
    verify_user_access(token_user_id, user_id)
    
    # Get task by ID
    task = session.get(Task, task_id)
    
    # Verify task exists and belongs to user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )
    
    # Delete task
    session.delete(task)
    session.commit()
    
    # 204 No Content - no response body needed
    return None


# ============================================================================
# ENDPOINT 6: PATCH /api/{user_id}/tasks/{task_id}/complete - Toggle completion
# ============================================================================

@router.patch(
    "/api/{user_id}/tasks/{task_id}/complete",
    response_model=TaskResponse
)
async def toggle_complete(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    token_user_id: str = Depends(verify_token)
):
    """
    Toggle task completion status
    
    - If completed=True, sets to False
    - If completed=False, sets to True
    
    Returns:
        Updated task with new completion status
    
    Raises:
        404: Task not found or doesn't belong to user
    
    Security:
        - Requires valid JWT token
        - Can only toggle own tasks
    """
    # Verify user can access this user_id
    verify_user_access(token_user_id, user_id)
    
    # Get task by ID
    task = session.get(Task, task_id)
    
    # Verify task exists and belongs to user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )
    
    # Toggle completion status
    task.completed = not task.completed
    
    # Update timestamp
    task.updated_at = datetime.utcnow()
    
    # Save changes
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task
