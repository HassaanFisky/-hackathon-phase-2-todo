# Routes package
# Import routers from submodules for easy access

from .tasks import router as tasks_router

__all__ = ["tasks_router"]
