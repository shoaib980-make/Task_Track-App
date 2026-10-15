
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="TaskTrack Python Service")


# Pydantic model: defines the required structure of a task
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=500)
    status: Literal["pending", "in progress", "completed"] = "pending"


# Temporary in-memory data
tasks = [
    {"id": 1, "title": "Learn Python",
     "description": "Practice Python fundamentals",
     "status": "pending"},
    {"id": 2, "title": "Build FastAPI",
     "description": "Create a REST API",
     "status": "in progress"},
]


@app.get("/")
def home():
    return {
        "success": True,
        "message": "Welcome to TaskTrack Python API"
    }


@app.get("/health")
def health_check():
    return {"success": True, "status": "healthy"}


@app.get("/api/tasks")
def get_tasks():
    return {
        "success": True,
        "count": len(tasks),
        "data": tasks
    }


# POST endpoint: create a new task
@app.post("/api/tasks", status_code=201)
def create_task(task: TaskCreate):
    new_task = {
        "id": max((item["id"] for item in tasks), default=0) + 1,
        **task.model_dump()
    }

    tasks.append(new_task)

    return {
        "success": True,
        "message": "Task created successfully",
        "data": new_task
    }
