"""
run.py — Unified entry point for the backend server.

Usage:
    python run.py                  # defaults to development
    python run.py development      # dev mode: reload, verbose logs
    python run.py production       # prod mode: Uvicorn, no reload

Environment variables (override defaults via .env or shell):
    BACKEND_HOST    default: 0.0.0.0
    BACKEND_PORT    default: 8000
    BACKEND_WORKERS default: 1 (dev), 4 (prod)
"""

import os
import sys
import subprocess
import uvicorn
from dotenv import load_dotenv

load_dotenv()


def run_development(host: str, port: int):
    """Start Uvicorn with hot-reload for local development."""
    print("\n  🚀  Development server starting...")
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info",
    )


def run_production(host: str, port: int, workers: int):
    """Start Uvicorn workers for production."""
    print(f"\n  🏭  Production server starting ({workers} workers)\n")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=False,
        workers=workers,
        log_level="warning",
    )


def main():
    # Load mode: check environment variable APP_ENV, default to "development".
    # This is overridden if a command line argument is provided.
    env_mode = os.getenv("APP_ENV", "development").lower()
    mode = sys.argv[1].lower() if len(sys.argv) > 1 else env_mode

    if mode not in ("development", "production"):
        print(f"  ❌  Unknown mode: '{mode}'")
        print(f"  Usage: python run.py [development|production]")
        sys.exit(1)

    is_prod = mode == "production"

    # Support both new HOST/PORT requirements and legacy BACKEND_HOST/BACKEND_PORT
    host = os.getenv("HOST", os.getenv("BACKEND_HOST", "0.0.0.0"))
    port = int(os.getenv("PORT", os.getenv("BACKEND_PORT", "8000")))
    workers = int(os.getenv("BACKEND_WORKERS", "2" if is_prod else "1"))

    if is_prod:
        run_production(host, port, workers)
    else:
        run_development(host, port)


if __name__ == "__main__":
    main()

