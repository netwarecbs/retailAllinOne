# Retail All-in-One Application - Docker Hub & Ubuntu Deployment Guide

This comprehensive guide will help you push your Retail All-in-One application to Docker Hub and deploy it on Ubuntu.

## 📋 Prerequisites

- Docker Hub account
- Ubuntu server (18.04+ recommended)
- Domain name (optional, for SSL)
- Basic knowledge of Docker and Linux

## 🚀 Step 1: Push to Docker Hub

### 1.1 Update Configuration

First, update the configuration files with your Docker Hub username:

```bash
# Replace 'your-dockerhub-username' with your actual Docker Hub username
sed -i 's/your-dockerhub-username/YOUR_DOCKERHUB_USERNAME/g' docker-compose.prod.yml
sed -i 's/your-dockerhub-username/YOUR_DOCKERHUB_USERNAME/g' build-and-push.sh
```

### 1.2 Login to Docker Hub

```bash
docker login
```

### 1.3 Build and Push Images

Make the build script executable and run it:

```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

This script will:
- Build all 4 applications (Web, Garment, Pharmacy, Retail)
- Push them to Docker Hub
- Clean up local images

### 1.4 Verify Images on Docker Hub

Check your Docker Hub repository to ensure all images are uploaded:
- `your-username/retail-allinone-web:latest`
- `your-username/retail-allinone-garment:latest`
- `your-username/retail-allinone-pharmacy:latest`
- `your-username/retail-allinone-retail:latest`

## 🐧 Step 2: Deploy on Ubuntu

### 2.1 Update Deployment Configuration

Update the deployment script with your details:

```bash
# Edit deploy-ubuntu.sh
nano deploy-ubuntu.sh

# Update these variables:
DOCKERHUB_USERNAME="your-dockerhub-username"
DOMAIN="your-domain.com"
EMAIL="your-email@example.com"
```

### 2.2 Run Deployment Script

```bash
chmod +x deploy-ubuntu.sh
./deploy-ubuntu.sh
```

This script will automatically:
- Update the Ubuntu system
- Install Docker and Docker Compose
- Install Nginx and Certbot
- Configure firewall
- Download and deploy the application
- Setup SSL certificates (if domain provided)
- Create systemd service for auto-start

### 2.3 Manual Deployment (Alternative)

If you prefer manual deployment:

#### Install Docker:
```bash
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
```

#### Install Docker Compose:
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Deploy Application:
```bash
# Create application directory
sudo mkdir -p /opt/retail-app
sudo chown $USER:$USER /opt/retail-app
cd /opt/retail-app

# Download configuration files
# (Copy docker-compose.prod.yml, nginx.conf from your project)

# Update with your Docker Hub username
sed -i 's/your-dockerhub-username/YOUR_DOCKERHUB_USERNAME/g' docker-compose.prod.yml

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Step 3: Configuration

### 3.1 SSL Certificate Setup

If you have a domain name, setup SSL:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/cert.pem ssl/key.pem

# Restart nginx container
docker-compose -f docker-compose.prod.yml restart nginx
```

### 3.2 Firewall Configuration

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 3.3 Auto-start Service

Create a systemd service for auto-start:

```bash
sudo tee /etc/systemd/system/retail-app.service > /dev/null << EOF
[Unit]
Description=Retail All-in-One Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/retail-app
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable retail-app.service
```

## 🌐 Step 4: Access Your Application

After successful deployment, your applications will be available at:

- **Web Application**: `http://your-domain.com` or `http://your-server-ip`
- **Garment Application**: `http://your-domain.com/garment`
- **Pharmacy Application**: `http://your-domain.com/pharmacy`
- **Retail Application**: `http://your-domain.com/retail`

## 🔍 Step 5: Monitoring and Management

### 5.1 Check Application Status

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check specific service logs
docker-compose -f docker-compose.prod.yml logs web
docker-compose -f docker-compose.prod.yml logs garment
docker-compose -f docker-compose.prod.yml logs pharmacy
docker-compose -f docker-compose.prod.yml logs retail
```

### 5.2 System Service Management

```bash
# Start application
sudo systemctl start retail-app

# Stop application
sudo systemctl stop retail-app

# Restart application
sudo systemctl restart retail-app

# Check status
sudo systemctl status retail-app
```

### 5.3 Update Application

To update your application:

```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Restart with new images
docker-compose -f docker-compose.prod.yml up -d

# Clean up old images
docker image prune -f
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Port conflicts**: Ensure ports 80, 443, 3000-3003 are available
2. **Permission issues**: Make sure user is in docker group
3. **SSL issues**: Verify domain DNS points to your server
4. **Memory issues**: Ensure server has at least 2GB RAM

### Debug Commands:

```bash
# Check Docker status
sudo systemctl status docker

# Check container logs
docker logs retail-web-prod
docker logs retail-garment-prod
docker logs retail-pharmacy-prod
docker logs retail-shop-prod

# Check nginx configuration
docker exec retail-nginx nginx -t

# Check system resources
htop
df -h
free -h
```

## 📊 Performance Optimization

### 1. Resource Limits

Add resource limits to docker-compose.prod.yml:

```yaml
services:
  web:
    # ... existing configuration
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### 2. Nginx Caching

The nginx configuration includes:
- Gzip compression
- Static file caching
- Rate limiting
- Security headers

### 3. SSL Renewal

Setup automatic SSL renewal:

```bash
# Add to crontab
sudo crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f /opt/retail-app/docker-compose.prod.yml restart nginx
```

## 🔒 Security Considerations

1. **Firewall**: Only open necessary ports
2. **SSL**: Always use HTTPS in production
3. **Updates**: Regularly update Docker images
4. **Monitoring**: Set up log monitoring
5. **Backups**: Regular backup of application data

## 📈 Scaling

For high-traffic scenarios:

1. **Load Balancer**: Use multiple nginx instances
2. **Database**: Add external database services
3. **CDN**: Use CloudFlare or similar for static assets
4. **Monitoring**: Add Prometheus and Grafana

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify configuration files
3. Ensure all services are running
4. Check firewall and network settings

## 📝 Notes

- Replace all placeholder values with your actual values
- Test the deployment in a staging environment first
- Keep your Docker Hub credentials secure
- Regularly update your application and dependencies

This guide provides a complete solution for deploying your Retail All-in-One application to production using Docker Hub and Ubuntu.
