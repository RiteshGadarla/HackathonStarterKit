#!/bin/bash
# =========================================================================
# deploy-backend.sh - Deploy the Backend on Ubuntu EC2
# =========================================================================

set -e

# ANSI Color codes for clean output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}🚀 Starting Backend Deployment on EC2${NC}"
echo -e "${BLUE}==========================================${NC}"

# 1. Update system package index
echo -e "\n${YELLOW}📦 Updating packages...${NC}"
sudo apt-get update -y

# 2. Check and Install Docker Engine
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker Engine...${NC}"
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Enable and start Docker service
    sudo systemctl enable docker
    sudo systemctl start docker
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker Engine installed successfully!${NC}"
else
    echo -e "${GREEN}✅ Docker Engine is already installed.${NC}"
fi

# 3. Check and Install Nginx on the Host
if ! command -v nginx &> /dev/null; then
    echo -e "\n${YELLOW}📦 Installing Nginx on the Host...${NC}"
    sudo apt-get install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo -e "${GREEN}✅ Nginx installed successfully!${NC}"
else
    echo -e "${GREEN}✅ Nginx is already installed.${NC}"
fi

# 4. Handle Backend environment variables
echo -e "\n${YELLOW}📄 Checking Environment Variables...${NC}"
if [ -f ./backend/.env ]; then
    echo -e "${GREEN}✅ Environment file ./backend/.env detected.${NC}"
else
    echo -e "${RED}❌ Error: ./backend/.env file not found!${NC}"
    echo -e "${YELLOW}Please create a ./backend/.env file before running this script.${NC}"
    echo -e "${YELLOW}You can copy the template from ./backend/.env.example using:${NC}"
    echo -e "${BLUE}  cp ./backend/.env.example ./backend/.env${NC}"
    exit 1
fi

# 5. Build the Backend multi-stage Docker image
echo -e "\n${YELLOW}🔨 Building Backend multi-stage Docker image...${NC}"
docker build -t hackathon-backend ./backend

# 6. Clean up old containers
if [ "$(docker ps -aq -f name=backend-app)" ]; then
    echo -e "${YELLOW}🛑 Stopping and removing existing backend container...${NC}"
    docker stop backend-app || true
    docker rm backend-app || true
fi

# 7. Run the new backend container bound ONLY to localhost
# We bind it internally to 127.0.0.1:8000 so it can only be accessed via Nginx on port 80.
echo -e "\n${YELLOW}🏃 Starting FastAPI container bound internally to port 8000 using environment file...${NC}"
docker run -d \
  --name backend-app \
  -p 127.0.0.1:8000:8000 \
  --env-file ./backend/.env \
  --restart unless-stopped \
  hackathon-backend

# 8. Configure Host Nginx Reverse Proxy
echo -e "\n${YELLOW}⚙️  Configuring Host Nginx Reverse Proxy...${NC}"
sudo cp ./backend/nginx.conf /etc/nginx/sites-available/hackathon-backend
sudo ln -sf /etc/nginx/sites-available/hackathon-backend /etc/nginx/sites-enabled/

# Remove the default Nginx welcome site to avoid page overlap
sudo rm -f /etc/nginx/sites-enabled/default || true

# Test configuration and reload Nginx
echo -e "${YELLOW}🔍 Testing Nginx configuration...${NC}"
sudo nginx -t
echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
sudo systemctl restart nginx

echo -e "\n${GREEN}==========================================${NC}"
echo -e "${GREEN}🎉 Backend Deployment Completed Successfully!${NC}"
echo -e "${GREEN}🌐 Nginx Reverse Proxy is Listening on: http://$(curl -s ifconfig.me || echo "your-backend-ec2-ip")${NC}"
echo -e "${BLUE}==========================================${NC}"
