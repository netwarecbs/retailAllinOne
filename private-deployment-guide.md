# Private Docker Hub Repository Deployment Guide

This guide covers deploying your Retail All-in-One application using **private Docker Hub repositories**.

## 🔐 Private Repository Setup

### 1. Create Private Repositories on Docker Hub

1. **Login to Docker Hub** and go to your dashboard
2. **Create 4 private repositories:**
   - `your-username/retail-allinone-web`
   - `your-username/retail-allinone-garment`
   - `your-username/retail-allinone-pharmacy`
   - `your-username/retail-allinone-retail`

3. **Set repository visibility to Private**

### 2. Authentication Setup

#### Option A: Using Credentials File (Recommended)

```bash
# Run the authentication script
chmod +x docker-login.sh
./docker-login.sh
```

This will:
- Prompt for your Docker Hub credentials
- Save them securely in `docker-credentials.sh`
- Login to Docker Hub

#### Option B: Manual Login

```bash
# Login manually
docker login

# Enter your Docker Hub credentials when prompted
```

## 🚀 Building and Pushing to Private Repositories

### 1. Update Configuration

Update your Docker Hub username in the configuration files:

```bash
# Update build script
sed -i 's/your-dockerhub-username/YOUR_DOCKERHUB_USERNAME/g' build-and-push.sh

# Update docker-compose files
sed -i 's/your-dockerhub-username/YOUR_DOCKERHUB_USERNAME/g' docker-compose.prod.yml
sed -i 's/your-dockerhub-username/YOUR_DOCKERHUB_USERNAME/g' docker-compose.private.yml
```

### 2. Build and Push

```bash
# Make sure you're logged in
docker login

# Build and push all images
./build-and-push.sh
```

The script will:
- Build all 4 applications
- Tag them with your private repository names
- Push to your private Docker Hub repositories

## 🐧 Deploying on Ubuntu Server

### 1. Transfer Credentials to Server

**Option A: Secure Transfer**
```bash
# Copy credentials file to server
scp docker-credentials.sh user@your-server:/opt/retail-app/
```

**Option B: Manual Login on Server**
```bash
# SSH to your server
ssh user@your-server

# Login to Docker Hub
docker login
```

### 2. Deploy Application

```bash
# On your Ubuntu server
chmod +x deploy-ubuntu.sh
./deploy-ubuntu.sh
```

The deployment script will:
- Use `docker-compose.private.yml` for private repositories
- Authenticate with Docker Hub
- Pull images from your private repositories
- Deploy the application

## 🔧 Private Repository Configuration

### Docker Compose for Private Repositories

The `docker-compose.private.yml` includes:

```yaml
services:
  web:
    image: your-username/retail-allinone-web:latest
    pull_policy: always  # Always pull latest from private repo
    # ... other configuration
```

### Authentication Requirements

1. **Docker Hub Login**: Required on both build and deployment machines
2. **Private Repository Access**: Your Docker Hub account must have access
3. **Credentials Security**: Keep credentials secure and don't commit to version control

## 🛡️ Security Best Practices

### 1. Credential Management

```bash
# Add to .gitignore
echo "docker-credentials.sh" >> .gitignore
echo "*.env" >> .gitignore

# Set proper permissions
chmod 600 docker-credentials.sh
```

### 2. Environment Variables

Create a `.env` file for sensitive data:

```bash
# .env file
DOCKERHUB_USERNAME=your-username
DOCKERHUB_PASSWORD=your-password
DOMAIN=your-domain.com
```

### 3. Secure Deployment

```bash
# Use environment variables
export DOCKERHUB_USERNAME="your-username"
export DOCKERHUB_PASSWORD="your-password"

# Or use Docker secrets (for production)
echo "your-password" | docker secret create dockerhub_password -
```

## 🔄 Automated Deployment with Private Repos

### 1. CI/CD Pipeline

Create a GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_PASSWORD }}
      
      - name: Build and Push
        run: ./build-and-push.sh
      
      - name: Deploy to Server
        run: |
          ssh user@server 'cd /opt/retail-app && docker-compose -f docker-compose.private.yml pull && docker-compose -f docker-compose.private.yml up -d'
```

### 2. Automated Updates

```bash
# Update script for private repositories
#!/bin/bash
# update-app.sh

# Login to Docker Hub
docker login

# Pull latest images
docker-compose -f docker-compose.private.yml pull

# Restart with new images
docker-compose -f docker-compose.private.yml up -d

# Clean up old images
docker image prune -f
```

## 🔍 Troubleshooting Private Repositories

### Common Issues:

1. **Authentication Failed**
   ```bash
   # Check login status
   docker info | grep Username
   
   # Re-login if needed
   docker logout
   docker login
   ```

2. **Permission Denied**
   ```bash
   # Ensure you have access to private repositories
   docker pull your-username/retail-allinone-web:latest
   ```

3. **Image Not Found**
   ```bash
   # Verify repository names and tags
   docker search your-username/retail-allinone-web
   ```

### Debug Commands:

```bash
# Check Docker Hub authentication
docker info

# List local images
docker images | grep retail-allinone

# Test pulling from private repo
docker pull your-username/retail-allinone-web:latest

# Check container logs
docker-compose -f docker-compose.private.yml logs
```

## 📊 Monitoring Private Repository Usage

### 1. Docker Hub Usage

- Monitor pull requests in Docker Hub dashboard
- Check repository access logs
- Set up usage alerts

### 2. Application Monitoring

```bash
# Check running containers
docker-compose -f docker-compose.private.yml ps

# Monitor resource usage
docker stats

# Check application logs
docker-compose -f docker-compose.private.yml logs -f
```

## 🔐 Advanced Security

### 1. Docker Content Trust

```bash
# Enable Docker Content Trust
export DOCKER_CONTENT_TRUST=1

# Sign images before pushing
docker trust key generate mykey
docker trust signer add mykey your-username/retail-allinone-web
```

### 2. Registry Authentication

```bash
# Use Docker registry authentication
docker login your-registry.com

# Configure registry in docker-compose
services:
  web:
    image: your-registry.com/retail-allinone-web:latest
```

## 📝 Summary

For private Docker Hub repositories:

1. **Create private repositories** on Docker Hub
2. **Set up authentication** using `docker-login.sh`
3. **Build and push** using `build-and-push.sh`
4. **Deploy with authentication** using `deploy-ubuntu.sh`
5. **Use `docker-compose.private.yml`** for private repository configuration
6. **Keep credentials secure** and don't commit to version control

This setup ensures your application images are private and secure while maintaining easy deployment and management.
