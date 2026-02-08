"""
FastAPI application entry point
Phase II: Todo Full-Stack Web Application
GIAIC Hackathon II
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import create_db_and_tables
from routes import tasks_router
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI application
app = FastAPI(
    title="Todo API - Phase II",
    description="GIAIC Hackathon II - Full-Stack Todo Application Backend",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI at /docs
    redoc_url="/redoc"  # ReDoc at /redoc
)

# ============================================================================
# CORS Configuration
# ============================================================================

# Get allowed origins from environment variable
# Default to localhost for development
# Default to allow all origins (*) for immediate connectivity
CORS_ORIGINS = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,  # Frontend URLs
    allow_credentials=True,  # Allow cookies/auth headers
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers (including Authorization)
)

# ============================================================================
# Include API Routes
# ============================================================================

app.include_router(tasks_router)

# ============================================================================
# Startup Event - Database Initialization
# ============================================================================

@app.on_event("startup")
async def on_startup():
    """
    Run on application startup
    Creates database tables if they don't exist
    """
    print("🚀 Starting FastAPI application...")
    print(f"📊 Allowed CORS origins: {CORS_ORIGINS}")
    
    # Create database tables
    create_db_and_tables()
    
    print("✅ Application startup complete")


# ============================================================================
# Root Endpoint - Health Check
# ============================================================================

@app.get("/")
async def root():
    """
    Root endpoint - confirms API is running
    """
    return {
        "message": "Todo API - Phase II",
        "status": "running",
        "version": "1.0.0",
        "hackathon": "GIAIC Hackathon II",
        "phase": "II - Full-Stack Web Application"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return {
        "status": "healthy",
        "database": "connected"
    }


# ============================================================================
# Run with: uvicorn main:app --reload --port 8000
# ============================================================================
