from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, deps
from .db.mongodb import connect_to_mongo, close_mongo_connection, get_database
from .core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── API Routes (all under /api prefix) ──────────────────────────────
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])


@app.get("/api/me")
async def read_users_me(current_user: dict = Depends(deps.get_current_user)):
    return current_user


@app.get("/api/health")
async def health_check():
    """Health check — verifies server and MongoDB are alive."""
    try:
        db = get_database()
        await db.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "ok",
        "database": db_status,
        "project": settings.PROJECT_NAME,
    }


@app.get("/api")
async def api_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}


@app.get("/")
async def root():
    return {"message": f"{settings.PROJECT_NAME} is running"}
