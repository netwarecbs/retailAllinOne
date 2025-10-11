# Docker Build Troubleshooting Guide

This guide helps resolve common Docker build issues with the Retail All-in-One monorepo.

## 🔍 Common Build Errors

### Error: "package.json not found"

**Problem**: Docker can't find package.json files during build.

**Solution**: Use the fixed Dockerfile approach:

```bash
# Use the fixed Dockerfile
docker build -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest .
```

### Error: "failed to compute cache key"

**Problem**: Docker build cache issues with monorepo structure.

**Solution**: Clear Docker cache and rebuild:

```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker build --no-cache -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest .
```

### Error: "target retail-runner: not found"

**Problem**: Dockerfile target not found.

**Solution**: Ensure you're using the correct Dockerfile:

```bash
# Check available targets
docker build --target help -f Dockerfile.fixed .

# Use correct target
docker build -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest .
```

## 🛠️ Build Solutions

### Solution 1: Fixed Dockerfile (Recommended)

Use `Dockerfile.fixed` which properly handles the monorepo structure:

```bash
# Build all applications
docker build -f Dockerfile.fixed --target web-runner -t your-username/retail-allinone-web:latest .
docker build -f Dockerfile.fixed --target garment-runner -t your-username/retail-allinone-garment:latest .
docker build -f Dockerfile.fixed --target pharmacy-runner -t your-username/retail-allinone-pharmacy:latest .
docker build -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest .
```

### Solution 2: Individual Build Script

Use the individual build script for each application:

```bash
chmod +x build-individual.sh
./build-individual.sh
```

### Solution 3: Manual Build Commands

Build each application manually:

```bash
# Web application
docker build -f Dockerfile.fixed --target web-runner -t your-username/retail-allinone-web:latest .

# Garment application  
docker build -f Dockerfile.fixed --target garment-runner -t your-username/retail-allinone-garment:latest .

# Pharmacy application
docker build -f Dockerfile.fixed --target pharmacy-runner -t your-username/retail-allinone-pharmacy:latest .

# Retail application
docker build -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest .
```

## 🔧 Build Optimization

### 1. Use BuildKit for Better Performance

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Build with BuildKit
docker build -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest .
```

### 2. Multi-platform Builds

```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest .
```

### 3. Build with Progress

```bash
# Build with progress output
docker build --progress=plain -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest .
```

## 🐛 Debug Build Issues

### 1. Check Build Context

```bash
# Verify files exist
ls -la apps/retail/package.json
ls -la packages/shared/package.json
ls -la packages/ui/package.json
```

### 2. Test Build Steps

```bash
# Test individual build steps
docker build --target deps -f Dockerfile.fixed .
docker build --target builder -f Dockerfile.fixed .
```

### 3. Inspect Build Layers

```bash
# Inspect build layers
docker history your-username/retail-allinone-retail:latest
```

## 📋 Pre-build Checklist

Before building, ensure:

1. **All package.json files exist**:
   ```bash
   ls apps/*/package.json
   ls packages/*/package.json
   ```

2. **Docker is running**:
   ```bash
   docker info
   ```

3. **Sufficient disk space**:
   ```bash
   df -h
   ```

4. **Docker Hub authentication**:
   ```bash
   docker login
   ```

## 🚀 Quick Fix Commands

### Complete Rebuild

```bash
# Stop all containers
docker-compose down

# Remove all images
docker rmi $(docker images -q)

# Clear build cache
docker builder prune -a

# Rebuild everything
./build-and-push.sh
```

### Single Application Rebuild

```bash
# Rebuild only retail application
docker build --no-cache -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest .
docker push your-username/retail-allinone-retail:latest
```

### Verify Build

```bash
# Test the built image
docker run -p 3000:3000 your-username/retail-allinone-retail:latest

# Check if application starts
curl http://localhost:3000
```

## 🔍 Build Log Analysis

### Common Log Patterns

1. **"COPY failed"**: File not found in build context
2. **"RUN failed"**: Command execution error
3. **"target not found"**: Incorrect Dockerfile target
4. **"permission denied"**: File permission issues

### Debug Commands

```bash
# Build with verbose output
docker build --progress=plain -f Dockerfile.fixed --target retail-runner -t your-username/retail-allinone-retail:latest . 2>&1 | tee build.log

# Check build log
grep -i error build.log
grep -i failed build.log
```

## 📞 Getting Help

If you're still experiencing issues:

1. **Check Docker version**: `docker --version`
2. **Check available space**: `df -h`
3. **Check Docker daemon**: `docker info`
4. **Review build logs**: Look for specific error messages
5. **Try individual builds**: Build one application at a time

## 🎯 Success Indicators

A successful build should show:
- ✅ All COPY commands succeed
- ✅ All RUN commands complete
- ✅ Final image is created
- ✅ Image can be pushed to Docker Hub
- ✅ Container starts without errors

Remember: The monorepo structure can be complex, so using the fixed Dockerfile approach is recommended for reliable builds.
