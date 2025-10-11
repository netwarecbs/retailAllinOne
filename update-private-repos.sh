#!/bin/bash

# Update Script for Private Docker Hub Repositories
# This script updates the application using private repositories

set -e

# Configuration
DOCKERHUB_USERNAME="your-dockerhub-username"
APP_NAME="retail-allinone"

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

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    log_success "Docker is running"
}

# Login to Docker Hub
docker_login() {
    log_info "Logging in to Docker Hub for private repository access..."
    
    # Check if already logged in
    if docker info | grep -q "Username:"; then
        log_info "Already logged in to Docker Hub"
        return 0
    fi
    
    # Check for credentials file
    if [ -f "docker-credentials.sh" ]; then
        log_info "Using saved credentials..."
        source docker-credentials.sh
        docker_login_private
    else
        log_warning "No credentials file found. Please login manually:"
        if ! docker login; then
            log_error "Failed to login to Docker Hub"
            exit 1
        fi
    fi
    
    log_success "Successfully logged in to Docker Hub"
}

# Update application
update_app() {
    log_info "Updating application from private repositories..."
    
    # Navigate to application directory
    if [ -d "/opt/retail-app" ]; then
        cd /opt/retail-app
    else
        log_error "Application directory not found. Please run deployment first."
        exit 1
    fi
    
    # Update docker-compose.private.yml with actual username
    if [ -f "docker-compose.private.yml" ]; then
        sed -i "s/your-dockerhub-username/${DOCKERHUB_USERNAME}/g" docker-compose.private.yml
    else
        log_error "docker-compose.private.yml not found"
        exit 1
    fi
    
    # Pull latest images
    log_info "Pulling latest images from private repositories..."
    docker-compose -f docker-compose.private.yml pull
    
    # Restart with new images
    log_info "Restarting application with new images..."
    docker-compose -f docker-compose.private.yml up -d
    
    # Clean up old images
    log_info "Cleaning up old images..."
    docker image prune -f
    
    log_success "Application updated successfully"
}

# Check application status
check_status() {
    log_info "Checking application status..."
    
    # Check container status
    docker-compose -f docker-compose.private.yml ps
    
    # Check if all containers are running
    if docker-compose -f docker-compose.private.yml ps | grep -q "Up"; then
        log_success "Application is running"
    else
        log_warning "Some containers may not be running. Check logs:"
        docker-compose -f docker-compose.private.yml logs
    fi
}

# Show application URLs
show_urls() {
    log_info "Application URLs:"
    echo "  - Web App: http://your-domain.com"
    echo "  - Garment App: http://your-domain.com/garment"
    echo "  - Pharmacy App: http://your-domain.com/pharmacy"
    echo "  - Retail App: http://your-domain.com/retail"
}

# Main execution
main() {
    log_info "Updating Retail All-in-One Application from Private Repositories"
    
    # Check prerequisites
    check_docker
    docker_login
    
    # Update application
    update_app
    
    # Check status
    check_status
    
    # Show URLs
    show_urls
    
    log_success "Update completed successfully!"
}

# Run main function
main "$@"
