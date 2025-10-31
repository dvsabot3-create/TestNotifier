#!/bin/bash

# Render MCP Server Setup Script for Claude Code
# This script configures Claude Code to use Render's MCP server

echo "🚀 Setting up Render MCP Server for Claude Code..."

# Claude Code MCP configuration paths
CLaude_CONFIG_DIR="$HOME/.config/claude"
CLaude_CONFIG_FILE="$CLaude_CONFIG_DIR/mcp.json"

# Create config directory if it doesn't exist
mkdir -p "$CLaude_CONFIG_DIR"

# Check if mcp.json exists
if [ -f "$CLaude_CONFIG_FILE" ]; then
    echo "📋 Found existing mcp.json file - backing it up..."
    cp "$CLaude_CONFIG_FILE" "$CLaude_CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Function to update or create mcp.json
update_mcp_config() {
    local api_key="$1"

    if [ -f "$CLaude_CONFIG_FILE" ]; then
        # Check if render server already exists
        if grep -q "\"render\"" "$CLaude_CONFIG_FILE"; then
            echo "🔄 Updating existing Render MCP configuration..."
            # Update existing render configuration
            sed -i.bak 's/"Authorization": "Bearer [^"]*"/"Authorization": "Bearer '"$api_key"'"/' "$CLaude_CONFIG_FILE"
        else
            echo "➕ Adding Render MCP server to existing configuration..."
            # Add render server to existing config
            sed -i.bak '/^}$/i\
  "render": {\
    "url": "https://mcp.render.com/mcp",\
    "headers": {\
      "Authorization": "Bearer '"$api_key"'"\
    }\
  }' "$CLaude_CONFIG_FILE"
        fi
    else
        echo "🆕 Creating new mcp.json configuration..."
        # Create new config file
        cat > "$CLaude_CONFIG_FILE" << EOF
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer $api_key"
      }
    }
  }
}
EOF
    fi
}

# Main setup function
main() {
    echo "📋 Claude Code MCP Configuration Setup"
    echo "======================================"

    # Check for API key argument
    if [ "$#" -eq 0 ]; then
        echo "❌ Please provide your Render API key as an argument"
        echo "Usage: ./setup-render-mcp.sh YOUR_API_KEY"
        echo ""
        echo "To get your API key:"
        echo "1. Go to https://dashboard.render.com"
        echo "2. Click Account Settings → API Keys"
        echo "3. Create a new API key"
        exit 1
    fi

    local api_key="$1"

    echo "🔑 Using API key: ${api_key:0:10}..."
    echo "📁 Configuration file: $CLaude_CONFIG_FILE"

    # Update configuration
    update_mcp_config "$api_key"

    echo ""
    echo "✅ Render MCP server configuration complete!"
    echo ""
    echo "🧪 To test the connection, run:"
    echo "   Set my Render workspace to [your-workspace-name]"
    echo ""
    echo "📋 To view your configuration:"
    echo "   cat $CLaude_CONFIG_FILE"
    echo ""
    echo "🔄 To update the API key later, just run this script again:"
    echo "   ./setup-render-mcp.sh YOUR_NEW_API_KEY"
}

# Run main function
main "$@"