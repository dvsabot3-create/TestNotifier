#!/bin/bash

# TestNotifier Website Deployment Script
# Production deployment automation for testnotifier.co.uk

set -euo pipefail  # Exit on error, undefined variables, pipe failures

# Configuration
PROJECT_NAME="testnotifier-website"
PRODUCTION_URL="https://testnotifier.co.uk"
DEPLOYMENT_USER="deploy"
REMOTE_HOST="testnotifier.co.uk"
REMOTE_PATH="/var/www/testnotifier"
BACKUP_PATH="/var/backups/testnotifier"
LOG_PATH="/var/log/testnotifier"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as correct user
check_user() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
        exit 1
    fi

    if [[ "$(whoami)" != "$DEPLOYMENT_USER" ]]; then
        error "This script should be run as user: $DEPLOYMENT_USER"
        exit 1
    fi
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Starting pre-deployment checks..."

    # Check if we're in the correct directory
    if [[ ! -f "package.json" ]] || [[ ! -d "src" ]]; then
        error "Not in the correct project directory"
        exit 1
    fi

    # Check if production build exists
    if [[ ! -d "dist" ]]; then
        error "Production build not found. Run 'npm run build' first."
        exit 1
    fi

    # Check if remote host is accessible
    if ! ping -c 1 "$REMOTE_HOST" &> /dev/null; then
        error "Remote host $REMOTE_HOST is not accessible"
        exit 1
    fi

    # Check SSH key authentication
    if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$DEPLOYMENT_USER@$REMOTE_HOST" "echo 'SSH OK'" &> /dev/null; then
        error "SSH key authentication failed for $DEPLOYMENT_USER@$REMOTE_HOST"
        exit 1
    fi

    success "Pre-deployment checks completed"
}

# Run tests
run_tests() {
    log "Running tests..."

    # Run unit tests
    if ! npm test; then
        error "Unit tests failed"
        exit 1
    fi

    # Run linting
    if ! npm run lint; then
        error "Linting failed"
        exit 1
    fi

    # Run type checking
    if ! npm run typecheck; then
        error "Type checking failed"
        exit 1
    fi

    success "All tests passed"
}

# Build production version
build_production() {
    log "Building production version..."

    # Clean previous build
    rm -rf dist/

    # Build production version
    if ! npm run build; then
        error "Production build failed"
        exit 1
    fi

    # Verify build output
    if [[ ! -d "dist" ]] || [[ -z "$(ls -A dist)" ]]; then
        error "Build output is empty"
        exit 1
    fi

    success "Production build completed"
}

# Create backup of current deployment
create_backup() {
    log "Creating backup of current deployment..."

    local backup_name="testnotifier-backup-$(date +%Y%m%d-%H%M%S)"
    local backup_path="$BACKUP_PATH/$backup_name"

    ssh "$DEPLOYMENT_USER@$REMOTE_HOST" << EOF
        mkdir -p "$BACKUP_PATH"
        if [[ -d "$REMOTE_PATH" ]]; then
            cp -r "$REMOTE_PATH" "$backup_path"
            echo "Backup created at $backup_path"
        else
            echo "No existing deployment to backup"
        fi
EOF

    success "Backup created: $backup_path"
    echo "$backup_path" > .last_backup_path
}

# Prepare remote server
prepare_remote_server() {
    log "Preparing remote server..."

    ssh "$DEPLOYMENT_USER@$REMOTE_HOST" << EOF
        # Create necessary directories
        sudo mkdir -p "$REMOTE_PATH"
        sudo mkdir -p "$LOG_PATH"
        sudo mkdir -p "$BACKUP_PATH"

        # Set permissions
        sudo chown -R www-data:www-data "$REMOTE_PATH"
        sudo chown -R www-data:www-data "$LOG_PATH"
        sudo chmod -R 755 "$REMOTE_PATH"
        sudo chmod -R 755 "$LOG_PATH"

        # Create log files
        sudo touch "$LOG_PATH/access.log"
        sudo touch "$LOG_PATH/error.log"
        sudo chown www-data:www-data "$LOG_PATH"/*.log

        echo "Remote server prepared successfully"
EOF

    success "Remote server prepared"
}

# Deploy files
deploy_files() {
    log "Deploying files to production server..."

    # Create temporary deployment directory
    local temp_dir="/tmp/testnotifier-deploy-$$"

    # Copy files to temporary location on remote server
    ssh "$DEPLOYMENT_USER@$REMOTE_HOST" "mkdir -p $temp_dir"

    # Sync files to remote server
    rsync -avz --delete \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='src' \
        --exclude='*.md' \
        --exclude='deploy*.sh' \
        dist/ "$DEPLOYMENT_USER@$REMOTE_HOST:$temp_dir/"

    # Move files to final location with proper permissions
    ssh "$DEPLOYMENT_USER@$REMOTE_HOST" << EOF
        # Stop web server temporarily
        sudo systemctl stop nginx

        # Backup current deployment
        if [[ -d "$REMOTE_PATH" ]]; then
            mv "$REMOTE_PATH" "$REMOTE_PATH.old"
        fi

        # Move new files to final location
        sudo mv "$temp_dir" "$REMOTE_PATH"

        # Set proper permissions
        sudo chown -R www-data:www-data "$REMOTE_PATH"
        sudo chmod -R 755 "$REMOTE_PATH"

        # Start web server
        sudo systemctl start nginx

        # Remove old backup after successful deployment
        if [[ -d "$REMOTE_PATH.old" ]]; then
            rm -rf "$REMOTE_PATH.old"
        fi

        echo "Files deployed successfully"
EOF

    success "Files deployed to production server"
}

# Post-deployment verification
post_deployment_verification() {
    log "Running post-deployment verification..."

    local max_attempts=30
    local attempt=1
    local success=false

    while [[ $attempt -le $max_attempts ]]; do
        log "Verification attempt $attempt of $max_attempts"

        # Check if website is accessible
        if curl -f -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL" | grep -q "200"; then
            success=true
            break
        fi

        # Check SSL certificate
        if ! echo | openssl s_client -servername "$REMOTE_HOST" -connect "$REMOTE_HOST:443" 2>/dev/null | openssl x509 -noout -checkend 86400; then
            warning "SSL certificate check failed on attempt $attempt"
        fi

        # Wait before next attempt
        sleep 10
        ((attempt++))
    done

    if [[ "$success" == true ]]; then
        success "Website is accessible at $PRODUCTION_URL"
    else
        error "Website is not accessible after $max_attempts attempts"
        exit 1
    fi

    # Verify security headers
    log "Verifying security headers..."
    local security_headers=$(curl -s -I "$PRODUCTION_URL" | grep -i "^content-security-policy\|^x-frame-options\|^x-content-type-options\|^strict-transport-security")

    if [[ -n "$security_headers" ]]; then
        success "Security headers are present"
    else
        warning "Some security headers may be missing"
    fi

    # Verify security.txt
    if curl -f -s "$PRODUCTION_URL/.well-known/security.txt" > /dev/null; then
        success "security.txt is accessible"
    else
        warning "security.txt is not accessible"
    fi

    success "Post-deployment verification completed"
}

# Performance testing
performance_testing() {
    log "Running performance tests..."

    # Test page load time
    local load_time=$(curl -o /dev/null -s -w "%{time_total}" "$PRODUCTION_URL")

    if (( $(echo "$load_time \u003c 3" | bc -l) )); then
        success "Page load time: ${load_time}s (under 3s target)"
    else
        warning "Page load time: ${load_time}s (above 3s target)"
    fi

    # Test SSL certificate
    local cert_info=$(echo | openssl s_client -servername "$REMOTE_HOST" -connect "$REMOTE_HOST:443" 2>/dev/null | openssl x509 -noout -dates)

    if echo "$cert_info" | grep -q "notAfter"; then
        local cert_expiry=$(echo "$cert_info" | grep "notAfter" | cut -d= -f2)
        success "SSL certificate valid until: $cert_expiry"
    else
        error "Could not verify SSL certificate expiry"
    fi

    success "Performance testing completed"
}

# Create deployment log
create_deployment_log() {
    local deployment_id="$(date +%Y%m%d-%H%M%S)-$$"
    local log_file="$LOG_PATH/deployment-$deployment_id.log"

    cat > "$log_file" << EOF
Deployment ID: $deployment_id
Date: $(date)
User: $(whoami)
Version: $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
Status: SUCCESS
Backup Path: $(cat .last_backup_path 2>/dev/null || echo "none")
Production URL: $PRODUCTION_URL

Deployment completed successfully at $(date)
EOF

    # Copy log to remote server
    scp "$log_file" "$DEPLOYMENT_USER@$REMOTE_HOST:$LOG_PATH/"

    log "Deployment log created: $log_file"
}

# Cleanup function
cleanup() {
    local exit_code=$?

    if [[ $exit_code -ne 0 ]]; then
        error "Deployment failed with exit code $exit_code"

        # Restore from backup if available
        if [[ -f .last_backup_path ]]; then
            local backup_path=$(cat .last_backup_path)
            warning "Restoring from backup: $backup_path"

            ssh "$DEPLOYMENT_USER@$REMOTE_HOST" "
                sudo systemctl stop nginx
                sudo rm -rf $REMOTE_PATH
                sudo cp -r $backup_path $REMOTE_PATH
                sudo chown -R www-data:www-data $REMOTE_PATH
                sudo systemctl start nginx
            "
        fi
    fi

    # Clean up temporary files
    rm -f .last_backup_path

    exit $exit_code
}

# Main deployment function
main() {
    log "Starting TestNotifier website deployment..."
    log "Target: $PRODUCTION_URL"
    log "Remote: $DEPLOYMENT_USER@$REMOTE_HOST"

    # Set up cleanup trap
    trap cleanup EXIT

    # Execute deployment steps
    check_user
    pre_deployment_checks
    run_tests
    build_production
    create_backup
    prepare_remote_server
    deploy_files
    post_deployment_verification
    performance_testing
    create_deployment_log

    success "Deployment completed successfully!"
    log "Website is now live at: $PRODUCTION_URL"
    log "Deployment log: $LOG_PATH/deployment-$(date +%Y%m%d-%H%M%S)-$$.log"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi