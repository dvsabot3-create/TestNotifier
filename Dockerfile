# Multi-stage build for TestNotifier website
FROM node:20-alpine AS builder

# Install build dependencies for native packages (gifsicle, etc.)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    autoconf \
    automake \
    libtool \
    nasm \
    libpng-dev \
    libjpeg-turbo-dev

# Set working directory
WORKDIR /app

# Copy website package files
COPY website/package*.json ./

# Install ALL dependencies (needed for build)
RUN npm install

# Copy website source
COPY website/ ./

# Build the application
RUN npm run build

# List contents of dist to verify build
RUN ls -la dist/

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files for production dependencies
COPY website/package*.json ./

# Install production dependencies (express, cors, bcrypt, jwt, googleapis, stripe)
RUN npm install --omit=dev

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Verify dist was copied
RUN ls -la dist/ && test -f dist/index.html || (echo "ERROR: dist/index.html not found!" && exit 1)

# Copy server file and API routes
COPY website/server.js ./
COPY website/api ./api

# Expose port (Render will override this with PORT env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/healthz', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server.js"]

