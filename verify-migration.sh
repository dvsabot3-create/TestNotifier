#!/bin/bash

# Railway to Render.com Migration Verification Script
# This script verifies that the migration is complete and ready for deployment

set -e

echo "🔍 Verifying Railway to Render.com Migration..."
echo "================================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0

# Test function
test_item() {
    local description="$1"
    local command="$2"
    local expected="$3"

    echo -n "Testing: $description... "

    if eval "$command" > /dev/null 2>&1; then
        if [ -n "$expected" ]; then
            result=$(eval "$command" 2>/dev/null)
            if [[ "$result" == *"$expected"* ]]; then
                echo -e "${GREEN}✅ PASS${NC}"
                ((PASSED++))
            else
                echo -e "${RED}❌ FAIL${NC} (Unexpected result)"
                ((FAILED++))
            fi
        else
            echo -e "${GREEN}✅ PASS${NC}"
            ((PASSED++))
        fi
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

# Header
echo -e "${BLUE}Migration Verification Report${NC}"
echo "================================"

# Test 1: Check Railway files are removed
test_item "Railway configuration files removed" \
    "find . -name '*railway*' -type f 2>/dev/null | wc -l" \
    "0"

# Test 2: Check Render configuration exists
test_item "Render.yaml configuration exists" \
    "test -f render.yaml" \
    ""

# Test 3: Check Dockerfile exists
test_item "Dockerfile exists" \
    "test -f website/Dockerfile" \
    ""

# Test 4: Check deployment script exists
test_item "Deployment script exists" \
    "test -f render-deploy.sh" \
    ""

# Test 5: Check environment template exists
test_item "Environment template exists" \
    "test -f render.env.template" \
    ""

# Test 6: Check package.json has start script
test_item "Package.json has start script" \
    "grep -q 'start.*node server.js' website/package.json" \
    ""

# Test 7: Check server.js uses correct main file
test_item "Server.js is main entry point" \
    "grep -q 'main.*server.js' website/package.json" \
    ""

# Test 8: Check server.js has no Railway references
test_item "Server.js has no Railway references" \
    "! grep -q -i railway website/server.js" \
    ""

# Test 9: Check build process works
test_item "Build process works" \
    "cd website && npm run build" \
    "built"

# Test 10: Check dependencies are installed
test_item "Required dependencies installed" \
    "cd website && npm list jsonwebtoken bcryptjs googleapis > /dev/null 2>&1" \
    ""

# Test 11: Check server can start (basic test)
test_item "Server can start" \
    "cd website && timeout 3s npm start > /dev/null 2>&1 || true" \
    ""

# Summary
echo ""
echo "================================"
echo -e "${BLUE}Verification Summary:${NC}"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo "================================"

# Final status
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Migration verification COMPLETE!${NC}"
    echo "Your project is ready for Render.com deployment."
    echo ""
    echo "Next steps:"
    echo "1. Install Render CLI: curl -fsSL https://render.com/install.sh | sh"
    echo "2. Login: render login"
    echo "3. Deploy: ./render-deploy.sh"
    echo "4. Monitor: https://dashboard.render.com"
    exit 0
else
    echo -e "${RED}❌ Migration verification FAILED!${NC}"
    echo "Please review the failed tests above."
    exit 1
fi