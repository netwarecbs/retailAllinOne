#!/bin/bash

# Ubuntu Deployment Script for Retail All-in-One Application
# This script sets up the production environment on Ubuntu

set -e

# Configuration
DOCKERHUB_USERNAME="your-dockerhub-username"
APP_NAME="retail-allinone"
DOMAIN="your-domain.com"
EMAIL="your-email@example.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system
update_system() {
    log_info "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    log_success "System updated successfully"
}

# Install Docker
install_docker() {
    log_info "Installing Docker..."
    
    # Remove old versions
    sudo apt remove -y docker docker-engine docker.io containerd runc
    
    # Install prerequisites
    sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    log_success "Docker installed successfully"
}

# Install Docker Compose
install_docker_compose() {
    log_info "Installing Docker Compose..."
    
    # Get latest version
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*?(?=")')
    
    # Download and install
    sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    log_success "Docker Compose installed successfully"
}

# Install Nginx
install_nginx() {
    log_info "Installing Nginx..."
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    log_success "Nginx installed successfully"
}

# Install Certbot for SSL
install_certbot() {
    log_info "Installing Certbot for SSL certificates..."
    sudo apt install -y certbot python3-certbot-nginx
    log_success "Certbot installed successfully"
}

# Configure firewall
configure_firewall() {
    log_info "Configuring firewall..."
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw --force enable
    log_success "Firewall configured successfully"
}

# Create application directory
create_app_directory() {
    log_info "Creating application directory..."
    sudo mkdir -p /opt/retail-app
    sudo chown $USER:$USER /opt/retail-app
    cd /opt/retail-app
    log_success "Application directory created"
}

# Download application files
download_app_files() {
    log_info "Downloading application files..."
    
    # Create necessary directories
    mkdir -p ssl
    
    # Download docker-compose.private.yml for private repositories
    cat > docker-compose.private.yml << 'EOF'
version: '3.8'

services:
  web:
    image: your-dockerhub-username/retail-allinone-web:latest
    container_name: retail-web-prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    restart: unless-stopped
    networks:
      - retail-network

  garment:
    image: your-dockerhub-username/retail-allinone-garment:latest
    container_name: retail-garment-prod
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    restart: unless-stopped
    networks:
      - retail-network

  pharmacy:
    image: your-dockerhub-username/retail-allinone-pharmacy:latest
    container_name: retail-pharmacy-prod
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    restart: unless-stopped
    networks:
      - retail-network

  retail:
    image: your-dockerhub-username/retail-allinone-retail:latest
    container_name: retail-shop-prod
    ports:
      - "3003:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    restart: unless-stopped
    networks:
      - retail-network

  nginx:
    image: nginx:alpine
    container_name: retail-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
      - garment
      - pharmacy
      - retail
    restart: unless-stopped
    networks:
      - retail-network

networks:
  retail-network:
    driver: bridge
EOF

    # Download nginx.conf
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream web {
        server web:3000;
    }
    
    upstream garment {
        server garment:3000;
    }
    
    upstream pharmacy {
        server pharmacy:3000;
    }
    
    upstream retail {
        server retail:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Main web application
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Main application (web)
        location / {
            proxy_pass http://web;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # Garment application
        location /garment {
            rewrite ^/garment/(.*) /$1 break;
            proxy_pass http://garment;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Pharmacy application
        location /pharmacy {
            rewrite ^/pharmacy/(.*) /$1 break;
            proxy_pass http://pharmacy;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Retail application
        location /retail {
            rewrite ^/retail/(.*) /$1 break;
            proxy_pass http://retail;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

    log_success "Application files downloaded"
}

# Deploy application
deploy_app() {
    log_info "Deploying application..."
    
    # Update docker-compose.private.yml with actual username
    sed -i "s/your-dockerhub-username/${DOCKERHUB_USERNAME}/g" docker-compose.private.yml
    sed -i "s/your-domain.com/${DOMAIN}/g" nginx.conf
    
    # Login to Docker Hub for private repositories
    log_info "Logging in to Docker Hub for private repository access..."
    if [ -f "docker-credentials.sh" ]; then
        source docker-credentials.sh
        docker_login_private
    else
        log_warning "No credentials file found. Please login manually:"
        docker login
    fi
    
    # Pull and start containers
    docker-compose -f docker-compose.private.yml pull
    docker-compose -f docker-compose.private.yml up -d
    
    log_success "Application deployed successfully"
}

# Setup SSL certificate
setup_ssl() {
    log_info "Setting up SSL certificate..."
    
    # Stop nginx container temporarily
    docker-compose -f docker-compose.private.yml stop nginx
    
    # Get SSL certificate
    sudo certbot certonly --standalone -d ${DOMAIN} -d www.${DOMAIN} --email ${EMAIL} --agree-tos --non-interactive
    
    # Copy certificates to ssl directory
    sudo cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ssl/cert.pem
    sudo cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ssl/key.pem
    sudo chown $USER:$USER ssl/cert.pem ssl/key.pem
    
    # Start nginx container
    docker-compose -f docker-compose.private.yml start nginx
    
    log_success "SSL certificate setup completed"
}

# Create systemd service for auto-start
create_systemd_service() {
    log_info "Creating systemd service for auto-start..."
    
    sudo tee /etc/systemd/system/retail-app.service > /dev/null << EOF
[Unit]
Description=Retail All-in-One Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/retail-app
ExecStart=/usr/local/bin/docker-compose -f docker-compose.private.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.private.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable retail-app.service
    
    log_success "Systemd service created and enabled"
}

# Main execution
main() {
    log_info "Starting Ubuntu deployment for Retail All-in-One Application"
    
    # Update system
    update_system
    
    # Install required software
    install_docker
    install_docker_compose
    install_nginx
    install_certbot
    
    # Configure system
    configure_firewall
    create_app_directory
    download_app_files
    
    # Deploy application
    deploy_app
    
    # Setup SSL (optional)
    if [ "$DOMAIN" != "your-domain.com" ]; then
        setup_ssl
    fi
    
    # Create auto-start service
    create_systemd_service
    
    log_success "Deployment completed successfully!"
    log_info "Your application is now running at:"
    log_info "  - Web App: http://${DOMAIN}"
    log_info "  - Garment App: http://${DOMAIN}/garment"
    log_info "  - Pharmacy App: http://${DOMAIN}/pharmacy"
    log_info "  - Retail App: http://${DOMAIN}/retail"
    
    log_info "To manage the application:"
    log_info "  - Start: sudo systemctl start retail-app"
    log_info "  - Stop: sudo systemctl stop retail-app"
    log_info "  - Status: sudo systemctl status retail-app"
    log_info "  - Logs: docker-compose -f docker-compose.prod.yml logs"
}

# Run main function
main "$@"
