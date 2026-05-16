"""
run.py — Unified entry point for the backend server.

Usage:
    python run.py                  # defaults to development
    python run.py development      # dev mode: reload, verbose logs
    python run.py production       # prod mode: Nginx + Uvicorn, no reload

Environment variables (override defaults via .env or shell):
    BACKEND_HOST    default: 0.0.0.0 (dev), 127.0.0.1 (prod)
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
    print(f"\n  🚀  Development server starting on http://{host}:{port}")
    print(f"  📄  Docs available at http://{host}:{port}/docs\n")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info",
    )


def run_production(host: str, port: int, workers: int):
    """Start Nginx reverse proxy + Uvicorn workers for production."""
    print(f"\n  🏭  Production server starting")
    print(f"  🔁  Nginx :5000 → Uvicorn {host}:{port} ({workers} workers)\n")

    # Start Nginx (assumes config is already at /etc/nginx/conf.d/default.conf)
    try:
        subprocess.Popen(["nginx"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("  ✅  Nginx started on :5000")
    except FileNotFoundError:
        print("  ⚠️  Nginx not found — running Uvicorn standalone")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=False,
        workers=workers,
        log_level="warning",
    )


def main():
    mode = sys.argv[1].lower() if len(sys.argv) > 1 else "development"

    if mode not in ("development", "production"):
        print(f"  ❌  Unknown mode: '{mode}'")
        print(f"  Usage: python run.py [development|production]")
        sys.exit(1)

    is_prod = mode == "production"

    host = os.getenv("BACKEND_HOST", "127.0.0.1" if is_prod else "0.0.0.0")
    port = int(os.getenv("BACKEND_PORT", "8000"))
    workers = int(os.getenv("BACKEND_WORKERS", "4" if is_prod else "1"))

    if is_prod:
        run_production(host, port, workers)
    else:
        run_development(host, port)


if __name__ == "__main__":
    main()
