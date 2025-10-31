#!/bin/bash

# TestNotifier Chrome Extension Deployment Script
# Chrome Web Store deployment automation

set -euo pipefail  # Exit on error, undefined variables, pipe failures

# Configuration
EXTENSION_NAME="TestNotifier - Multi-Pupil Manager"
EXTENSION_VERSION="2.1.0"
CHROME_WEB_STORE_API_URL="https://www.googleapis.com/chromewebstore/v1.1"
ITEM_ID="your-extension-item-id"  # Will be set after first upload
CLIENT_ID="your-oauth-client-id"
CLIENT_SECRET="your-oauth-client-secret"
REFRESH_TOKEN="your-refresh-token"

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

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check if we're in the correct directory
    if [[ ! -f "manifest.json" ]]; then
        error "Not in the extension directory (manifest.json not found)"
        exit 1
    fi

    # Check if Chrome Web Store package exists
    if [[ ! -f "chrome-web-store-package/testnotifier-extension-v2.1.0.zip" ]]; then
        error "Chrome Web Store package not found"
        error "Run the build script first to create the package"
        exit 1
    fi

    # Check for required tools
    if ! command -v curl > /dev/null 2>&1; then
        error "curl is required but not installed"
        exit 1
    fi

    if ! command -v jq > /dev/null 2>&1; then
        error "jq is required but not installed"
        exit 1
    fi

    success "Prerequisites check completed"
}

# Validate extension package
validate_package() {
    log "Validating extension package..."

    local package_path="chrome-web-store-package/testnotifier-extension-v2.1.0.zip"

    # Check if package exists and is not empty
    if [[ ! -s "$package_path" ]]; then
        error "Extension package is empty or doesn't exist"
        exit 1
    fi

    # Extract and validate manifest
    local temp_dir="/tmp/testnotifier-extension-$$"
    mkdir -p "$temp_dir"

    unzip -q "$package_path" -d "$temp_dir"

    # Validate manifest.json
    if [[ ! -f "$temp_dir/manifest.json" ]]; then
        error "manifest.json not found in package"
        rm -rf "$temp_dir"
        exit 1
    fi

    # Check manifest version
    local manifest_version=$(jq -r '.version' "$temp_dir/manifest.json")
    if [[ "$manifest_version" != "$EXTENSION_VERSION" ]]; then
        error "Manifest version ($manifest_version) doesn't match expected version ($EXTENSION_VERSION)"
        rm -rf "$temp_dir"
        exit 1
    fi

    # Check manifest version compliance
    local manifest_version_number=$(jq -r '.manifest_version' "$temp_dir/manifest.json")
    if [[ "$manifest_version_number" != "3" ]]; then
        error "Manifest version $manifest_version_number is not version 3"
        rm -rf "$temp_dir"
        exit 1
    fi

    # Validate required fields
    local required_fields=("name" "version" "manifest_version" "description" "permissions")
    for field in "${required_fields[@]}"; do
        if ! jq -e ".${field}" "$temp_dir/manifest.json" > /dev/null 2>&1; then
            error "Required field '$field' missing from manifest.json"
            rm -rf "$temp_dir"
            exit 1
        fi
    done

    # Check for potentially problematic permissions
    local permissions=$(jq -r '.permissions[]?' "$temp_dir/manifest.json")
    if echo "$permissions" | grep -q "tabs"; then
        warning "Extension requests 'tabs' permission - ensure it's justified"
    fi

    # Validate icons
    local icon_sizes=("16" "32" "48" "128")
    for size in "${icon_sizes[@]}"; do
        if [[ ! -f "$temp_dir/icons/simple/icon${size}.png" ]] && [[ ! -f "$temp_dir/icons/icon${size}.png" ]]; then
            warning "Icon size ${size}x${size} not found"
        fi
    done

    # Check for security issues
    if find "$temp_dir" -name "*.js" -exec grep -l "eval\|Function\|setTimeout.*string\|setInterval.*string" {} \; | head -1 | read; then
        warning "JavaScript files contain potentially unsafe code patterns"
    fi

    # Clean up
    rm -rf "$temp_dir"

    success "Extension package validation completed"
}

# Get access token
get_access_token() {
    log "Getting access token..."

    local token_response=$(curl -s -X POST \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "client_id=$CLIENT_ID" \
        -d "client_secret=$CLIENT_SECRET" \
        -d "refresh_token=$REFRESH_TOKEN" \
        -d "grant_type=refresh_token" \
        "https://oauth2.googleapis.com/token")

    local access_token=$(echo "$token_response" | jq -r '.access_token')

    if [[ -z "$access_token" ]] || [[ "$access_token" == "null" ]]; then
        error "Failed to get access token"
        echo "Response: $token_response"
        exit 1
    fi

    echo "$access_token"
    success "Access token obtained"
}

# Upload extension to Chrome Web Store
upload_extension() {
    local access_token="$1"
    local package_path="chrome-web-store-package/testnotifier-extension-v2.1.0.zip"

    log "Uploading extension to Chrome Web Store..."

    local upload_response=$(curl -s -X PUT \
        -H "Authorization: Bearer $access_token" \
        -H "x-goog-api-version: 2" \
        -F "upload=@$package_path" \
        "$CHROME_WEB_STORE_API_URL/items/$ITEM_ID")

    local upload_state=$(echo "$upload_response" | jq -r '.uploadState')

    if [[ "$upload_state" != "SUCCESS" ]]; then
        error "Upload failed with state: $upload_state"
        echo "Response: $upload_response"
        exit 1
    fi

    success "Extension uploaded successfully"
    echo "$upload_response"
}

# Publish extension
publish_extension() {
    local access_token="$1"

    log "Publishing extension..."

    local publish_response=$(curl -s -X POST \
        -H "Authorization: Bearer $access_token" \
        -H "x-goog-api-version: 2" \
        -H "Content-Length: 0" \
        "$CHROME_WEB_STORE_API_URL/items/$ITEM_ID/publish")

    local publish_status=$(echo "$publish_response" | jq -r '.status')

    if [[ "$publish_status" != "OK" ]]; then
        error "Publish failed with status: $publish_status"
        echo "Response: $publish_response"
        exit 1
    fi

    success "Extension published successfully"
}

# Check publication status
check_publication_status() {
    local access_token="$1"

    log "Checking publication status..."

    local status_response=$(curl -s -X GET \
        -H "Authorization: Bearer $access_token" \
        -H "x-goog-api-version: 2" \
        "$CHROME_WEB_STORE_API_URL/items/$ITEM_ID")

    local publication_status=$(echo "$status_response" | jq -r '.status')
    local item_version=$(echo "$status_response" | jq -r '.version')

    echo "Publication Status: $publication_status"
    echo "Item Version: $item_version"

    if [[ "$publication_status" == "PUBLISHED" ]]; then
        success "Extension is published and available in Chrome Web Store"
    elif [[ "$publication_status" == "IN_REVIEW" ]]; then
        warning "Extension is under review"
    elif [[ "$publication_status" == "REJECTED" ]]; then
        error "Extension was rejected"
        echo "Full response: $status_response"
        exit 1
    else
        warning "Unknown publication status: $publication_status"
    fi
}

# Get extension statistics
get_extension_stats() {
    local access_token="$1"

    log "Getting extension statistics..."

    local stats_response=$(curl -s -X GET \
        -H "Authorization: Bearer $access_token" \
        -H "x-goog-api-version: 2" \
        "$CHROME_WEB_STORE_API_URL/items/$ITEM_ID/stats")

    echo "Extension Statistics:"
    echo "$stats_response" | jq '.'
}

# Create deployment summary
create_deployment_summary() {
    local access_token="$1"
    local deployment_id="$(date +%Y%m%d-%H%M%S)"
    local summary_file="extension-deployment-$deployment_id-summary.txt"

    cat > "$summary_file" << EOF
TestNotifier Chrome Extension Deployment Summary
================================================

Deployment ID: $deployment_id
Date: $(date)
Extension Name: $EXTENSION_NAME
Extension Version: $EXTENSION_VERSION
Chrome Web Store Item ID: $ITEM_ID

Deployment Steps Completed:
1. ✅ Prerequisites check
2. ✅ Package validation
3. ✅ Authentication successful
4. ✅ Extension uploaded
5. ✅ Extension published
6. ✅ Status verification

Next Steps:
1. Monitor Chrome Web Store for approval
2. Check extension analytics after 24 hours
3. Monitor user feedback and reviews
4. Address any issues reported by users

Store Links:
- Chrome Web Store: https://chrome.google.com/webstore/detail/$ITEM_ID
- Developer Dashboard: https://chrome.google.com/webstore/devconsole/

Support Contacts:
- Technical: hello@testnotifier.co.uk
- Store Issues: store-support@testnotifier.co.uk
- User Feedback: feedback@testnotifier.co.uk

Monitoring:
- Extension will be monitored for issues
- User feedback will be collected
- Performance metrics will be tracked

Deployment completed successfully at $(date)
EOF

    success "Deployment summary created: $summary_file"
}

# Rollback function
rollback() {
    log "Rollback functionality not implemented for Chrome Web Store"
    warning "Chrome Web Store does not support rollback of published extensions"
    warning "If you need to revert changes, you must:")
    warning "1. Fix the issues in your code")
    warning "2. Increment the version number")
    warning "3. Upload and publish a new version")
    warning "4. The old version will remain available until the new version is approved")
}

# Cleanup function
cleanup() {
    local exit_code=$?

    if [[ $exit_code -ne 0 ]]; then
        error "Extension deployment failed with exit code $exit_code"
        log "Consider checking Chrome Web Store developer console for more details"
    fi

    exit $exit_code
}

# Main deployment function
main() {
    log "Starting TestNotifier Chrome Extension deployment..."
    log "Extension: $EXTENSION_NAME v$EXTENSION_VERSION"

    # Set up cleanup trap
    trap cleanup EXIT

    # Check if item ID is set
    if [[ "$ITEM_ID" == "your-extension-item-id" ]]; then
        error "ITEM_ID not configured. Please set it to your Chrome Web Store item ID."
        error "You can get this after the first upload through the developer console."
        exit 1
    fi

    # Execute deployment steps
    check_prerequisites
    validate_package

    local access_token=$(get_access_token)
    upload_extension "$access_token"
    publish_extension "$access_token"
    check_publication_status "$access_token"
    get_extension_stats "$access_token"
    create_deployment_summary "$access_token"

    success "Chrome Extension deployment completed successfully!"
    log "Extension should be available in Chrome Web Store within a few hours"
    log "Monitor the developer console for approval status"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi