# Hackathon StarterKit

Full-stack template — **React (Vite) + FastAPI + MongoDB**.  
Auth, database, proxy, and Docker all pre-configured. Clone and start building.

---

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/            # Route handlers (auth, deps)
│   │   ├── core/           # Config & security (bcrypt, JWT)
│   │   ├── db/             # MongoDB connection
│   │   ├── models/         # Pydantic models
│   │   └── main.py         # FastAPI entry point
│   ├── run.py              # Unified server launcher (dev / prod)
│   ├── nginx.conf          # Production reverse proxy config
│   ├── Dockerfile          # Backend Docker image
│   ├── .env.example        # Backend env template
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Navbar, shared UI
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Landing, Login, Signup, Dashboard
│   │   └── styles/         # Tailwind v4 entry
│   ├── .env.example        # Frontend env template
│   └── vite.config.js      # Vite config with proxy
├── package.json            # Root scripts (concurrently)
└── README.md
```

---

## 🚀 Quick Start (Development)

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running locally (or an Atlas connection string)

### 1. Install everything

```bash
# Linux / macOS
npm run install:linux

# Windows
npm run install:windows
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# → Edit backend/.env (set MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID)

# Frontend
cp frontend/.env.example frontend/.env
# → Edit frontend/.env (set VITE_GOOGLE_CLIENT_ID)
```

### 3. Start dev servers

```bash
# Both frontend + backend together
npm run dev:linux      # or dev:windows

# Or run them separately
npm run backend:linux  # starts FastAPI via run.py development
npm run frontend       # starts Vite dev server
```

| Service  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:5173    |
| Backend  | http://localhost:8000    |
| API Docs | http://localhost:8000/docs |

The Vite dev server proxies all `/api/*` requests to the backend automatically.

---

## 🔀 Request Flow

### Development

```
Browser (:5173)
  ├── GET /login           → Vite serves React (HMR)
  └── POST /api/auth/login → Vite proxy → FastAPI (:8000)
```

### Production (Docker)

```
Browser (:5000)
  └── POST /auth/login → Nginx (:5000) → Uvicorn (:8000/api/)
```

---

## 🐳 Docker — Backend

All commands assume you are in the project root.

### Build

```bash
cd backend
docker build -t starter-backend .
```

### Run with env file

```bash
cd backend
docker run -p 5000:5000 --env-file .env starter-backend
```

### Run with inline env vars

```bash
cd backend
docker run -p 5000:5000 \
  -e MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/mydb" \
  -e JWT_SECRET="my-production-secret" \
  -e CORS_ORIGINS="https://myapp.com" \
  starter-backend
```

### How it works inside the container

```
Nginx (:5000)  →  Uvicorn (:8000, 4 workers)
```

- Nginx listens on port **5000** (the only exposed port)
- Proxies all requests to Uvicorn at `127.0.0.1:8000/api/`
- `run.py production` starts both Nginx and multi-worker Uvicorn

### Docker env defaults

| Variable | Default (in Dockerfile) | Description |
|---|---|---|
| `BACKEND_HOST` | `127.0.0.1` | Uvicorn bind host |
| `BACKEND_PORT` | `8000` | Uvicorn bind port |
| `BACKEND_WORKERS` | `4` | Uvicorn worker count |

All app env vars (`MONGO_URI`, `JWT_SECRET`, etc.) should be injected at runtime via `--env-file` or `-e` flags.

---

## 🔧 run.py — Server Modes

```bash
cd backend

# Development — hot reload, verbose logs, 0.0.0.0:8000
./venv/bin/python run.py development

# Production — Nginx + multi-worker Uvicorn, 127.0.0.1:8000
./venv/bin/python run.py production
```

| Mode | Reload | Host | Workers | Nginx |
|---|---|---|---|---|
| `development` | ✅ | `0.0.0.0` | 1 | ❌ |
| `production` | ❌ | `127.0.0.1` | 4 | ✅ |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGO_URI` | ✅ | `mongodb://localhost:27017` | MongoDB connection string |
| `DATABASE_NAME` | ✅ | `app_db` | Database name |
| `JWT_SECRET` | ✅ | — | Secret for signing JWTs |
| `JWT_ALGORITHM` | | `HS256` | Signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | | `43200` | Token TTL (30 days) |
| `GOOGLE_CLIENT_ID` | ✅ | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | | — | Google OAuth secret |
| `CORS_ORIGINS` | | `localhost:5173,localhost:3000` | Comma-separated allowed origins |
| `BACKEND_HOST` | | `0.0.0.0` | Server bind host |
| `BACKEND_PORT` | | `8000` | Server bind port |
| `BACKEND_WORKERS` | | `4` | Uvicorn worker count (prod) |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | | `/api` | API base URL. Empty = Vite proxy |
| `VITE_PROXY_TARGET` | | `http://localhost:8000` | Backend URL for Vite dev proxy |
| `VITE_GOOGLE_CLIENT_ID` | ✅ | — | Google OAuth client ID |
| `VITE_APP_NAME` | | `Hackathon Starter` | App display name |

---

## 📜 Available Scripts

Run from the project root:

| Script | Description |
|---|---|
| `npm run install:linux` | Install all deps (Node + Python venv) |
| `npm run install:windows` | Same for Windows |
| `npm run dev:linux` | Start frontend + backend concurrently |
| `npm run dev:windows` | Same for Windows |
| `npm run backend:linux` | Start backend only (dev mode) |
| `npm run frontend` | Start frontend only |
| `npm run activate:linux` | Drop into activated venv shell |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4, Framer Motion |
| Backend | FastAPI, Uvicorn, Motor (async MongoDB) |
| Auth | JWT (python-jose), Google OAuth, bcrypt |
| Database | MongoDB |
| Proxy (dev) | Vite dev server proxy |
| Proxy (prod) | Nginx reverse proxy |
| Container | Docker |
