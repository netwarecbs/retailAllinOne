#!/bin/bash

# Docker Hub Login Script for Private Repositories
# This script handles authentication for private Docker Hub repositories

set -e

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
    
    # Prompt for credentials
    echo "Enter your Docker Hub credentials:"
    read -p "Username: " DOCKER_USERNAME
    read -s -p "Password: " DOCKER_PASSWORD
    echo
    
    # Login to Docker Hub
    echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin
    
    if [ $? -eq 0 ]; then
        log_success "Successfully logged in to Docker Hub"
    else
        log_error "Failed to login to Docker Hub"
        exit 1
    fi
}

# Save credentials for deployment server
save_credentials() {
    log_info "Saving credentials for deployment server..."
    
    # Create credentials file (will be used on deployment server)
    cat > docker-credentials.sh << EOF
#!/bin/bash
# Docker Hub credentials for private repositories
export DOCKER_USERNAME="$DOCKER_USERNAME"
export DOCKER_PASSWORD="$DOCKER_PASSWORD"

# Login function
docker_login_private() {
    echo "\$DOCKER_PASSWORD" | docker login --username "\$DOCKER_USERNAME" --password-stdin
}
EOF
    
    chmod +x docker-credentials.sh
    log_success "Credentials saved to docker-credentials.sh"
    log_warning "Keep this file secure and do not commit it to version control"
}

# Main execution
main() {
    log_info "Setting up Docker Hub authentication for private repositories"
    
    check_docker
    docker_login
    save_credentials
    
    log_success "Docker Hub authentication setup completed!"
    log_info "You can now build and push to your private repositories"
}

# Run main function
main "$@"
