FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# ── Install dependencies (cached layer) ─────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ── Copy application source ─────────────────────────────────────────
COPY app/ ./app/
COPY run.py .

ENV APP_ENV=production
ENV BACKEND_PORT=8000
ENV BACKEND_HOST=0.0.0.0
ENV BACKEND_WORKERS=2

EXPOSE 8000

# Start via run.py in production mode
CMD ["python", "run.py", "production"]

