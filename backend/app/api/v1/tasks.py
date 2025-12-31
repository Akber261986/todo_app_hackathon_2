from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional
import uuid
from ...database.session import engine
from ...models.task import Task, TaskBase
from ...schemas.task import TaskCreate, TaskUpdate, TaskResponse
from ...auth.jwt import get_current_user_id
from ...models.user import User

router = APIRouter()

@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    """
    Get all tasks for the authenticated user
    """
    with Session(engine) as session:
        # Build query with user filtering
        query = select(Task).where(Task.user_id == current_user_id)

        # Apply completion filter if provided
        if completed is not None:
            query = query.where(Task.complete == completed)

        # Apply pagination
        query = query.offset(skip).limit(limit)

        tasks = session.exec(query).all()
        return tasks


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    current_user_id: uuid.UUID = Depends(get_current_user_id)
):
    """
    Create a new task for the authenticated user
    """
    with Session(engine) as session:
        # Create task with user_id association
        task = Task(
            **task_data.model_dump(),
            user_id=current_user_id
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        return task


@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: uuid.UUID,
    current_user_id: uuid.UUID = Depends(get_current_user_id)
):
    """
    Get a specific task for the authenticated user
    """
    with Session(engine) as session:
        # Get task and verify it belongs to the authenticated user
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if task.user_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return task


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: uuid.UUID,
    task_update: TaskUpdate,
    current_user_id: uuid.UUID = Depends(get_current_user_id)
):
    """
    Update a specific task for the authenticated user
    """
    with Session(engine) as session:
        # Get task and verify it belongs to the authenticated user
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if task.user_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Update task with provided data
        update_data = task_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        session.add(task)
        session.commit()
        session.refresh(task)
        return task


@router.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task_partial(
    task_id: uuid.UUID,
    task_update: TaskUpdate,
    current_user_id: uuid.UUID = Depends(get_current_user_id)
):
    """
    Partially update a specific task for the authenticated user (typically for toggling completion status)
    """
    with Session(engine) as session:
        # Get task and verify it belongs to the authenticated user
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if task.user_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Update task with provided data
        update_data = task_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        session.add(task)
        session.commit()
        session.refresh(task)
        return task


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: uuid.UUID,
    current_user_id: uuid.UUID = Depends(get_current_user_id)
):
    """
    Delete a specific task for the authenticated user
    """
    with Session(engine) as session:
        # Get task and verify it belongs to the authenticated user
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if task.user_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        session.delete(task)
        session.commit()
        return {"message": "Task deleted successfully"}