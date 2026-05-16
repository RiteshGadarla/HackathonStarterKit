FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Install dependencies (cached layer) ─────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ── Copy application source ─────────────────────────────────────────
COPY app/ ./app/
COPY run.py .

# ── Nginx config ────────────────────────────────────────────────────
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

ENV APP_ENV=production
ENV BACKEND_PORT=8000
ENV BACKEND_HOST=127.0.0.1
ENV BACKEND_WORKERS=2

EXPOSE 5000

# Start via run.py in production mode (Nginx + Uvicorn)
CMD ["python", "run.py", "production"]
