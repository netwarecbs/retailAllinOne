#!/bin/bash

# Setup script for deployment files
echo "Setting up deployment files..."

# Make scripts executable
chmod +x build-and-push.sh
chmod +x deploy-ubuntu.sh

echo "✅ Scripts are now executable"
echo ""
echo "📋 Next steps:"
echo "1. Update your Docker Hub username in the following files:"
echo "   - docker-compose.prod.yml"
echo "   - build-and-push.sh"
echo "   - deploy-ubuntu.sh"
echo ""
echo "2. Update your domain name in:"
echo "   - deploy-ubuntu.sh"
echo "   - nginx.conf"
echo ""
echo "3. Run the build and push script:"
echo "   ./build-and-push.sh"
echo ""
echo "4. Deploy on Ubuntu server:"
echo "   ./deploy-ubuntu.sh"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
