# Dockerfile Analysis for Local Development

## 🔍 Issues with Current Dockerfile

### 1. **Missing Shared Package Build**
**Problem**: The current Dockerfile doesn't build shared packages before building apps.

**Impact**: Apps will fail to build because they depend on shared packages.

**Fix**: Add `RUN npm run build:packages` before building apps.

### 2. **Incorrect Production Runner**
**Problem**: The production runner only copies web app files but tries to run all apps.

**Impact**: Only web app will work, other apps will fail.

**Fix**: Create separate runners for each app or use multi-stage builds.

### 3. **Development Stage Issues**
**Problem**: Development stage doesn't build shared packages.

**Impact**: Development containers will fail to start.

**Fix**: Add shared package build in development stage.

### 4. **Missing Dependencies**
**Problem**: Some apps might need additional dependencies.

**Impact**: Build failures or runtime errors.

**Fix**: Ensure all required dependencies are installed.

## ✅ Corrected Dockerfile Structure

### For Local Development (Recommended)

```dockerfile
# Development Dockerfile
FROM node:18-alpine AS development
WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/*/package.json ./apps/*/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build shared packages (CRITICAL for monorepo)
RUN npm run build:packages

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Expose ports
EXPOSE 3000 3001 3002 3003

# Default command
CMD ["npm", "run", "dev:local"]
```

### For Production (Multi-stage)

```dockerfile
# Multi-stage production build
FROM node:18-alpine AS base

# Dependencies stage
FROM base AS deps
# ... install dependencies

# Builder stage
FROM base AS builder
# ... build shared packages first
RUN npm run build:packages
# ... then build all apps
RUN npm run build

# Individual runners for each app
FROM base AS web-runner
# ... web app specific setup

FROM base AS garment-runner
# ... garment app specific setup

FROM base AS pharmacy-runner
# ... pharmacy app specific setup

FROM base AS retail-runner
# ... retail app specific setup
```

## 🚀 Recommended Setup

### 1. **Use Corrected Dockerfile**

Replace your current `Dockerfile` with `Dockerfile.corrected`:

```bash
# Backup current Dockerfile
cp Dockerfile Dockerfile.backup

# Use corrected version
cp Dockerfile.corrected Dockerfile
```

### 2. **Update Docker Compose**

Your `docker-compose.yml` is mostly correct, but ensure it uses the right target:

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      target: development  # This is correct
    # ... rest of configuration
```

### 3. **Development Workflow**

```bash
# Start development environment
docker-compose up --build

# Or use the npm script
npm run dev
```

## 🔧 Key Fixes Applied

### 1. **Shared Package Build**
```dockerfile
# Build shared packages first (CRITICAL)
RUN npm run build:packages

# Then build all applications
RUN npm run build
```

### 2. **Proper Development Setup**
```dockerfile
# Development stage with all dependencies
FROM base AS development
# ... install all dependencies
# ... build shared packages
# ... set development environment
```

### 3. **Multi-stage Production Builds**
```dockerfile
# Separate runners for each application
FROM base AS web-runner
FROM base AS garment-runner
FROM base AS pharmacy-runner
FROM base AS retail-runner
```

## 🎯 Testing the Corrected Dockerfile

### 1. **Test Development Build**
```bash
# Build development image
docker build -f Dockerfile.corrected --target development -t retail-dev .

# Test the build
docker run -p 3000:3000 retail-dev
```

### 2. **Test Individual Production Builds**
```bash
# Test web app build
docker build -f Dockerfile.corrected --target web-runner -t retail-web .

# Test retail app build
docker build -f Dockerfile.corrected --target retail-runner -t retail-retail .
```

### 3. **Test Docker Compose**
```bash
# Start all services
docker-compose up --build

# Check if all containers are running
docker-compose ps
```

## 🚨 Common Issues and Solutions

### Issue 1: "Module not found" errors
**Cause**: Shared packages not built
**Solution**: Ensure `npm run build:packages` runs before building apps

### Issue 2: Build failures
**Cause**: Missing dependencies or incorrect paths
**Solution**: Use the corrected Dockerfile with proper directory structure

### Issue 3: Development containers not starting
**Cause**: Missing shared package builds
**Solution**: Build shared packages in development stage

### Issue 4: Production images too large
**Cause**: Including dev dependencies in production
**Solution**: Use multi-stage builds with separate production runners

## 📋 Checklist for Correct Dockerfile

- ✅ **Shared packages built first** (`npm run build:packages`)
- ✅ **All dependencies installed** (including dev dependencies for development)
- ✅ **Proper directory structure** (apps and packages)
- ✅ **Multi-stage builds** for production
- ✅ **Development environment** properly configured
- ✅ **All applications** can be built individually
- ✅ **Docker Compose** works with the Dockerfile

## 🎉 Expected Results

With the corrected Dockerfile:

1. **Development**: All apps start successfully with hot reload
2. **Production**: Each app can be built and deployed independently
3. **Monorepo**: Shared packages work correctly across all apps
4. **Docker Compose**: All services start without errors
5. **Builds**: No more "package.json not found" errors

The corrected Dockerfile properly handles the monorepo structure and ensures all applications can be developed and deployed successfully.
