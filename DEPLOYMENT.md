# AWS EC2 Production Deployment & Architecture Manual

This document provides step-by-step instructions to deploy the **Hackathon Starter Kit** in a fully separated production architecture using two **Ubuntu AWS EC2** instances.

---

## 🏗️ Architecture Design

```
                     ╔═════════════════════════════════════════╗
                     ║              User Browser               ║
                     ╚═════════════════════════════════════════╝
                                  │               │
      🌐 Frontend HTTP/S Requests │               │ 📡 API HTTP/S Requests
      (e.g., http://myfrontend)   │               │ (e.g., http://mybackend/api)
                                  ▼               ▼
      ╔═══════════════════════════════════╗   ╔═══════════════════════════════════╗
      ║           Frontend EC2            ║   ║            Backend EC2            ║
      ║         (Public Port 80)          ║   ║     (Public Port 80 -> 8000)      ║
      ║ ───────────────────────────────── ║   ║ ───────────────────────────────── ║
      ║   ┌───────────────────────────┐   ║   ║   ┌───────────────────────────┐   ║
      ║   │    Host Nginx Server*     │   ║   ║   │ Host Nginx Reverse Proxy  │   ║
      ║   │ (Inside Docker Container) │   ║   ║   │     (Port 80 Public)      │   ║
      ║   └─────────────┬─────────────┘   ║   ║   └─────────────┬─────────────┘   ║
      ║                 │                 ║   ║                 │ 🔄 Internal Proxy
      ║                 ▼                 ║   ║                 ▼ (Loopback)
      ║   ┌───────────────────────────┐   ║   ║   ┌───────────────────────────┐   ║
      ║   │    Static Assets served   │   ║   ║   │ FastAPI Docker Container  │   ║
      ║   │    (Vite/React Build)     │   ║   ║   │ (Port 127.0.0.1:8000)     ║
      ║   └───────────────────────────┘   ║   ║   └─────────────┬─────────────┘   ║
      ╚═══════════════════════════════════╝   ╚════════════════─┼─────────────────╝
                                                                │
                                                                ▼
                                              ╔═══════════════════════════════════╗
                                              ║       MongoDB Atlas (Cloud)       ║
                                              ╚═══════════════════════════════════╝
```

*Note: In the default configuration, if the user leaves `VITE_API_BASE_URL` set to `/api`, the **Frontend Host Nginx** will proxy API requests to the backend IP/domain. If the user sets `VITE_API_BASE_URL` to a full URL (e.g. `http://mybackend`), the browser will make API calls directly to the **Backend EC2 Host Nginx** reverse proxy.*

---

## 🖥️ AWS EC2 Instance Requirements

For optimal, lightweight production setups, we recommend the following parameters:

| Role               | Instance Type                | OS               | Security Group Rules (Inbound)                                                                                                                   |
| :----------------- | :--------------------------- | :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | `t2.micro` or `t3.micro` | Ubuntu 22.04 LTS | • Port `80` (HTTP) - Public (`0.0.0.0/0`) `<br>` • Port `443` (HTTPS) - Public (`0.0.0.0/0`) `<br>` • Port `22` (SSH) - Your IP |
| **Backend**  | `t2.micro` or `t3.micro` | Ubuntu 22.04 LTS | • Port `80` (HTTP) - Public (`0.0.0.0/0`) `<br>` • Port `443` (HTTPS) - Public (`0.0.0.0/0`) `<br>` • Port `22` (SSH) - Your IP |

---

## 🗄️ Database Strategy: MongoDB Atlas

Since the frontend and backend are separated on standalone EC2 instances, a local single-node MongoDB container is **not recommended** for production. Instead, utilize **MongoDB Atlas (Cloud)**:

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/products/platform/atlas-database).
2. Deploy a free shared M0 cluster.
3. In **Network Access**, allow access from the Backend EC2 Public IP address (or `0.0.0.0/0` temporarily during development).
4. Get your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/database_name?retryWrites=true&w=majority`.
5. Insert this string into the backend `.env` file as `MONGO_URI`.

---

## 🚀 Deployment Walkthrough

### 1. Deploy the Backend EC2 Instance First

We boot the backend first to obtain its Public IP/domain, which will be passed to the frontend.

#### Step 1A: Connect to your Backend EC2 and Clone Repository

```bash
ssh -i /path/to/key.pem ubuntu@your-backend-ec2-ip
git clone https://github.com/your-username/HackathonStarterKit.git
cd HackathonStarterKit
```

#### Step 1B: Configure Production Environment Variables

Create the backend `.env` file:

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Fill out the variables as required:

```env
APP_ENV=production
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=*
MONGO_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/app_db?retryWrites=true&w=majority
JWT_SECRET=YOUR_SECURE_RANDOM_LONG_SECRET_KEY
GOOGLE_CLIENT_ID=your_google_client_id_here
```

#### Step 1C: Run the Deployment Script

```bash
chmod +x deploy-backend.sh
./deploy-backend.sh
```

This automated script:

1. Installs Docker Engine on the host.
2. Installs Nginx on the host.
3. Builds the optimized multi-stage FastAPI container.
4. Starts the backend container securely bound to internal port `127.0.0.1:8000` (blocking direct internet bypass).
5. Copies the reverse proxy configuration, disables default layouts, and reboots Host Nginx.

---

### 2. Deploy the Frontend EC2 Instance

#### Step 2A: Connect to your Frontend EC2 and Clone Repository

```bash
ssh -i /path/to/key.pem ubuntu@your-frontend-ec2-ip
git clone https://github.com/your-username/HackathonStarterKit.git
cd HackathonStarterKit
```

#### Step 2B: Configure Frontend Environment Variables

Create the frontend `.env` file:

```bash
cp frontend/.env.example frontend/.env
nano frontend/.env
```

Fill out the variables.

* **Option A (Direct in-browser connection to Backend - Recommended)**:
  Set `VITE_API_BASE_URL` to your Backend EC2's Public IP or domain:

  ```env
  VITE_API_BASE_URL=http://your-backend-ec2-ip
  VITE_APP_ENV=production
  ```

* **Option B (Proxy through Frontend Nginx)**:
  If you want the Frontend Nginx to act as the intermediary proxy:

  ```env
  VITE_API_BASE_URL=/api
  VITE_APP_ENV=production
  ```

  *(If using Option B, make sure to set the `VITE_API_BASE_URL` environment variable to `http://your-backend-ec2-ip` in your system environment when starting the container, or write it directly into Nginx's configurations).*

#### Step 2C: Run the Deployment Script

```bash
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

This automated script:

1. Installs Docker Engine.
2. Builds the multi-stage static asset package (Nginx serving `dist/` index files).
3. Reads your `.env` settings and starts the container publicly on port `80`.

---

## 🔒 Enabling SSL / HTTPS (Production Grade Security)

To transition to HTTPS securely using **Let's Encrypt** and **Certbot**, follow these commands:

### For the Backend EC2 Host (Host Nginx Reverse Proxy)

Since Nginx runs directly on the host, Certbot configuration is incredibly simple:

```bash
# Install Certbot and the Nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Request and install the SSL certificate
# Replace api.yourdomain.com with your domain pointing to the Backend EC2 IP
sudo certbot --nginx -d api.yourdomain.com

# Verify renewal service status
sudo systemctl status certbot.timer
```

Certbot will automatically read your backend Nginx reverse proxy configuration, request a trusted certificate from Let's Encrypt, append secure SSL paths (on port 443), and force HTTP-to-HTTPS redirection automatically!

### For the Frontend EC2 Host (Containerized Nginx)

Since the frontend Nginx runs inside a Docker container, the easiest and most robust method is to install **Certbot on the host** and share the SSL directory into the container, OR configure **Host Nginx** on the Frontend EC2 to listen on ports 80/443 and proxy down to the frontend container running on internal port 8080!

#### Recommended Host Nginx Setup on Frontend EC2

1. Run the frontend Docker container internally on port `8080` (change the `-p 80:80` mapping in `deploy-frontend.sh` to `-p 127.0.0.1:8080:80`).
2. Install Nginx directly on the Frontend EC2 host:

   ```bash
   sudo apt install nginx -y
   ```

3. Create a simple reverse proxy host configuration `/etc/nginx/sites-available/frontend`:

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       location / {
           proxy_pass http://127.0.0.1:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. Link it and reload:

   ```bash
   sudo ln -sf /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo systemctl restart nginx
   ```

5. Obtain the SSL Certificate via Certbot on the host:

   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com
   ```

This wraps your frontend inside highly secure HTTPS automatically, maintaining a clean Docker container design!

---

## 🛠️ Verification & Troubleshooting

### Verify Deployments

* **Frontend Web Access**: Open `http://your-frontend-ec2-ip` in your browser. Ensure the page loads cleanly and the "Backend: Connected" indicator glows green!
* **Backend API Health Check**: Navigate to `http://your-backend-ec2-ip/api/health`. It should return a JSON indicating database connection status:

  ```json
  {"status":"ok","database":"connected","project":"Hackathon Starter"}
  ```

### Useful Troubleshooting Commands

#### Container Logs

```bash
# View backend application logs (errors, request paths)
docker logs backend-app --tail 100

# View frontend server logs
docker logs frontend-app --tail 100
```

#### Container Management

```bash
# Check running container statuses
docker ps

# Restart services
docker restart backend-app
docker restart frontend-app
```

#### Nginx Host Logs (Backend EC2 only)

```bash
# Check Nginx syntax
sudo nginx -t

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```
