#!/bin/bash
# =========================================================================
# deploy-frontend.sh - Deploy the Frontend on Ubuntu EC2
# =========================================================================

set -e

# ANSI Color codes for clean output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}🚀 Starting Frontend Deployment on EC2${NC}"
echo -e "${BLUE}==========================================${NC}"

# 1. Update system package index
echo -e "\n${YELLOW}📦 Updating packages...${NC}"
sudo apt-get update -y

# 2. Check and Install Docker if missing
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
    
    # Add current user to docker group to avoid sudo requirements (takes effect on new shell)
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker Engine installed successfully!${NC}"
else
    echo -e "${GREEN}✅ Docker Engine is already installed.${NC}"
fi

# 3. Handle Frontend environment variables
echo -e "\n${YELLOW}📄 Checking Environment Variables...${NC}"
if [ -f ./frontend/.env ]; then
    echo -e "${GREEN}✅ Environment file ./frontend/.env detected.${NC}"
    
    # Dynamically extract all VITE_ environment variables to pass as Docker build-args
    BUILD_ARGS=""
    while IFS= read -r line || [ -n "$line" ]; do
        # Strip comments and ensure line contains a VITE_ variable definition
        clean_line=$(echo "$line" | sed 's/#.*//' | xargs)
        if echo "$clean_line" | grep -q "^VITE_"; then
            key=$(echo "$clean_line" | cut -d'=' -f1 | xargs)
            value=$(echo "$clean_line" | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs)
            BUILD_ARGS="$BUILD_ARGS --build-arg $key=$value"
        fi
    done < ./frontend/.env
    echo -e "${GREEN}📝 Loaded Vite build arguments dynamically.${NC}"
else
    echo -e "${RED}❌ Error: ./frontend/.env file not found!${NC}"
    echo -e "${YELLOW}Please create a ./frontend/.env file before running this script.${NC}"
    echo -e "${YELLOW}You can copy the template from ./frontend/.env.example using:${NC}"
    echo -e "${BLUE}  cp ./frontend/.env.example ./frontend/.env${NC}"
    exit 1
fi

# 4. Build the Frontend Docker image
echo -e "\n${YELLOW}🔨 Building Frontend multi-stage Docker image...${NC}"
docker build $BUILD_ARGS -t hackathon-frontend ./frontend

# 5. Clean up old containers
if [ "$(docker ps -aq -f name=frontend-app)" ]; then
    echo -e "${YELLOW}🛑 Stopping and removing existing frontend container...${NC}"
    docker stop frontend-app || true
    docker rm frontend-app || true
fi

# 6. Run the new frontend container
echo -e "\n${YELLOW}🏃 Starting Frontend container on Port 80 using environment file...${NC}"
docker run -d \
  --name frontend-app \
  -p 80:80 \
  --env-file ./frontend/.env \
  --restart unless-stopped \
  hackathon-frontend

echo -e "\n${GREEN}==========================================${NC}"
echo -e "${GREEN}🎉 Frontend Deployment Completed Successfully!${NC}"
echo -e "${GREEN}🌐 Access your app at: http://$(curl -s ifconfig.me || echo "your-frontend-ec2-ip")${NC}"
echo -e "${BLUE}==========================================${NC}"
