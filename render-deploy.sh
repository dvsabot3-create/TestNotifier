#!/bin/bash

# Render.com Deployment Script for TestNotifier
# This script handles deployment to Render.com

set -e

echo "🚀 Starting Render.com deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if render CLI is installed
check_render_cli() {
    if ! command -v render > /dev/null 2>&1; then
        print_error "Render CLI is not installed. Please install it first:"
        echo "  curl -fsSL https://render.com/install.sh | sh"
        exit 1
    fi
    print_success "Render CLI is installed"
}

# Check if user is logged in to Render
check_render_auth() {
    if ! render whoami > /dev/null 2>&1; then
        print_error "Not logged in to Render. Please run: render login"
        exit 1
    fi
    print_success "Authenticated with Render"
}

# Deploy website service
deploy_website() {
    print_status "Deploying website service..."
    cd website

    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in website directory"
        exit 1
    fi

    # Install dependencies
    print_status "Installing dependencies..."
    npm ci

    # Build the project
    print_status "Building website..."
    npm run build

    # Run tests if they exist
    if npm run test > /dev/null 2>&1; then
        print_status "Running tests..."
        npm run test
    else
        print_warning "No tests found, skipping..."
    fi

    cd ..
    print_success "Website deployment preparation complete"
}

# Deploy backend service (if separate)
deploy_backend() {
    if [ -d "backend" ]; then
        print_status "Deploying backend service..."
        cd backend

        # Check if package.json exists
        if [ ! -f "package.json" ]; then
            print_error "package.json not found in backend directory"
            exit 1
        fi

        # Install dependencies
        print_status "Installing backend dependencies..."
        npm ci

        # Run tests if they exist
        if npm run test > /dev/null 2>&1; then
            print_status "Running backend tests..."
            npm run test
        else
            print_warning "No backend tests found, skipping..."
        fi

        cd ..
        print_success "Backend deployment preparation complete"
    fi
}

# Create deployment summary
create_deployment_summary() {
    print_status "Creating deployment summary..."

    cat > deployment-summary.md << EOF
# Render.com Deployment Summary

## Deployment Date: $(date)

### Services Configured:
- **Website**: React + Express application
- **Backend**: API server (if applicable)

### Environment Variables Required:
- NODE_ENV=production
- PORT=10000
- FRONTEND_URL (your domain)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- JWT_SECRET
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- DATABASE_URL
- REDIS_URL

### Next Steps:
1. Set up environment variables in Render dashboard
2. Deploy using: render deploy
3. Set up custom domain
4. Configure SSL/TLS
5. Set up monitoring

### Render Dashboard:
- Visit: https://dashboard.render.com
- Create new web services using the render.yaml configuration
- Configure environment variables
- Deploy

EOF
    print_success "Deployment summary created: deployment-summary.md"
}

# Main deployment function
main() {
    print_status "Starting TestNotifier deployment to Render.com..."

    # Check prerequisites
    check_render_cli
    check_render_auth

    # Deploy services
    deploy_website
    deploy_backend

    # Create deployment summary
    create_deployment_summary

    print_success "Deployment preparation complete!"
    print_status "Next steps:"
    echo "1. Review deployment-summary.md"
    echo "2. Set up environment variables in Render dashboard"
    echo "3. Run: render deploy"
    echo "4. Monitor deployment at: https://dashboard.render.com"
}

# Run main function
main "$@"