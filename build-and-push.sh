#!/bin/bash

# Build and Push Script for Retail All-in-One Application
# Make sure to replace 'your-dockerhub-username' with your actual Docker Hub username

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
    log_info "Logging in to Docker Hub..."
    
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
        log_info "Please login to Docker Hub manually:"
        if ! docker login; then
            log_error "Failed to login to Docker Hub"
            exit 1
        fi
    fi
    
    log_success "Successfully logged in to Docker Hub"
}

# Build and push Web application
build_web() {
    log_info "Building Web application..."
    docker build -f Dockerfile.fixed --target web-runner -t ${DOCKERHUB_USERNAME}/${APP_NAME}-web:latest .
    log_success "Web application built successfully"
    
    log_info "Pushing Web application to Docker Hub..."
    docker push ${DOCKERHUB_USERNAME}/${APP_NAME}-web:latest
    log_success "Web application pushed successfully"
}

# Build and push Garment application
build_garment() {
    log_info "Building Garment application..."
    docker build -f Dockerfile.fixed --target garment-runner -t ${DOCKERHUB_USERNAME}/${APP_NAME}-garment:latest .
    log_success "Garment application built successfully"
    
    log_info "Pushing Garment application to Docker Hub..."
    docker push ${DOCKERHUB_USERNAME}/${APP_NAME}-garment:latest
    log_success "Garment application pushed successfully"
}

# Build and push Pharmacy application
build_pharmacy() {
    log_info "Building Pharmacy application..."
    docker build -f Dockerfile.fixed --target pharmacy-runner -t ${DOCKERHUB_USERNAME}/${APP_NAME}-pharmacy:latest .
    log_success "Pharmacy application built successfully"
    
    log_info "Pushing Pharmacy application to Docker Hub..."
    docker push ${DOCKERHUB_USERNAME}/${APP_NAME}-pharmacy:latest
    log_success "Pharmacy application pushed successfully"
}

# Build and push Retail application
build_retail() {
    log_info "Building Retail application..."
    docker build -f Dockerfile.fixed --target retail-runner -t ${DOCKERHUB_USERNAME}/${APP_NAME}-retail:latest .
    log_success "Retail application built successfully"
    
    log_info "Pushing Retail application to Docker Hub..."
    docker push ${DOCKERHUB_USERNAME}/${APP_NAME}-retail:latest
    log_success "Retail application pushed successfully"
}

# Clean up local images
cleanup() {
    log_info "Cleaning up local images..."
    docker image prune -f
    log_success "Cleanup completed"
}

# Main execution
main() {
    log_info "Starting build and push process for Retail All-in-One Application"
    
    # Check prerequisites
    check_docker
    docker_login
    
    # Build and push all applications
    build_web
    build_garment
    build_pharmacy
    build_retail
    
    # Cleanup
    cleanup
    
    log_success "All applications have been built and pushed to Docker Hub successfully!"
    log_info "You can now deploy using: docker-compose -f docker-compose.prod.yml up -d"
}

# Run main function
main "$@"
