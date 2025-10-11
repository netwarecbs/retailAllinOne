#!/bin/bash

# Individual Application Build Script for Monorepo
# This script builds each application separately to avoid monorepo issues

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

# Build Web application
build_web() {
    log_info "Building Web application..."
    
    # Create temporary Dockerfile for web app
    cat > Dockerfile.web << 'EOF'
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build web application
RUN cd apps/web && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
EOF

    docker build -f Dockerfile.web -t ${DOCKERHUB_USERNAME}/${APP_NAME}-web:latest .
    log_success "Web application built successfully"
    
    log_info "Pushing Web application to Docker Hub..."
    docker push ${DOCKERHUB_USERNAME}/${APP_NAME}-web:latest
    log_success "Web application pushed successfully"
    
    # Clean up
    rm Dockerfile.web
}

# Build Garment application
build_garment() {
    log_info "Building Garment application..."
    
    # Create temporary Dockerfile for garment app
    cat > Dockerfile.garment << 'EOF'
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/garment/package.json ./apps/garment/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build garment application
RUN cd apps/garment && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/garment/public ./apps/garment/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/garment/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/garment/.next/static ./apps/garment/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/garment/server.js"]
EOF

    docker build -f Dockerfile.garment -t ${DOCKERHUB_USERNAME}/${APP_NAME}-garment:latest .
    log_success "Garment application built successfully"
    
    log_info "Pushing Garment application to Docker Hub..."
    docker push ${DOCKERHUB_USERNAME}/${APP_NAME}-garment:latest
    log_success "Garment application pushed successfully"
    
    # Clean up
    rm Dockerfile.garment
}

# Build Pharmacy application
build_pharmacy() {
    log_info "Building Pharmacy application..."
    
    # Create temporary Dockerfile for pharmacy app
    cat > Dockerfile.pharmacy << 'EOF'
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/pharmacy/package.json ./apps/pharmacy/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build pharmacy application
RUN cd apps/pharmacy && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/pharmacy/public ./apps/pharmacy/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/pharmacy/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/pharmacy/.next/static ./apps/pharmacy/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/pharmacy/server.js"]
EOF

    docker build -f Dockerfile.pharmacy -t ${DOCKERHUB_USERNAME}/${APP_NAME}-pharmacy:latest .
    log_success "Pharmacy application built successfully"
    
    log_info "Pushing Pharmacy application to Docker Hub..."
    docker push ${DOCKERHUB_USERNAME}/${APP_NAME}-pharmacy:latest
    log_success "Pharmacy application pushed successfully"
    
    # Clean up
    rm Dockerfile.pharmacy
}

# Build Retail application
build_retail() {
    log_info "Building Retail application..."
    
    # Create temporary Dockerfile for retail app
    cat > Dockerfile.retail << 'EOF'
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/retail/package.json ./apps/retail/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build retail application
RUN cd apps/retail && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/retail/public ./apps/retail/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/retail/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/retail/.next/static ./apps/retail/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/retail/server.js"]
EOF

    docker build -f Dockerfile.retail -t ${DOCKERHUB_USERNAME}/${APP_NAME}-retail:latest .
    log_success "Retail application built successfully"
    
    log_info "Pushing Retail application to Docker Hub..."
    docker push ${DOCKERHUB_USERNAME}/${APP_NAME}-retail:latest
    log_success "Retail application pushed successfully"
    
    # Clean up
    rm Dockerfile.retail
}

# Clean up local images
cleanup() {
    log_info "Cleaning up local images..."
    docker image prune -f
    log_success "Cleanup completed"
}

# Main execution
main() {
    log_info "Starting individual build process for Retail All-in-One Application"
    
    # Check prerequisites
    check_docker
    docker_login
    
    # Build and push all applications individually
    build_web
    build_garment
    build_pharmacy
    build_retail
    
    # Cleanup
    cleanup
    
    log_success "All applications have been built and pushed to Docker Hub successfully!"
    log_info "You can now deploy using: docker-compose -f docker-compose.private.yml up -d"
}

# Run main function
main "$@"
