"""
Database connection and session management
Connects to Neon Serverless PostgreSQL
"""

from sqlmodel import create_engine, SQLModel, Session
from typing import Generator
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set. "
        "Create backend/.env file with Neon connection string."
    )

# Validate PostgreSQL connection string
if not DATABASE_URL.startswith("postgresql://"):
    raise ValueError(
        "DATABASE_URL must be a PostgreSQL connection string "
        "(starts with postgresql://)"
    )

# Create SQLModel engine
# echo=True shows SQL queries in logs (useful for debugging)
# connect_args required for Neon SSL connection
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    connect_args={"sslmode": "require"}  # Required for Neon
)


def create_db_and_tables():
    """
    Create all database tables defined in models.py
    Called on application startup
    """
    SQLModel.metadata.create_all(engine)
    print("✅ Database tables created successfully")


def get_session() -> Generator[Session, None, None]:
    """
    Dependency function for FastAPI routes
    Provides a database session for each request
    Automatically closes session after request completes
    
    Usage in route:
        @app.get("/example")
        def example(session: Session = Depends(get_session)):
            # Use session here
            pass
    """
    with Session(engine) as session:
        yield session
