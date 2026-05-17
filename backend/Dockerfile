# ── Stage 1: Build stage (install compilers and compile python packages) ──────
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install compilation tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install requirements into /install prefix
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Stage 2: Final runtime stage (lightweight, compilation-free) ─────────────
FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Default environment configurations (can be overridden at runtime)
ENV APP_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000

WORKDIR /app

# Copy installed dependencies from builder
COPY --from=builder /install /usr/local

# Copy application source code
COPY app/ ./app/
COPY run.py .

EXPOSE 8000

# Start via run.py using production launcher settings
CMD ["python", "run.py", "production"]
