#!/bin/bash

echo "Starting deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Build and start the containers
echo "Building and starting containers..."
docker-compose up --build -d

echo "Deployment complete! API is running on http://localhost:5000"
echo "Try these endpoints:"
echo "- GET /api/health"
echo "- GET /api/users"
echo "- GET /api/users/1"
echo "- POST /api/users (with JSON body: {\"name\": \"New User\", \"email\": \"new@example.com\"})"