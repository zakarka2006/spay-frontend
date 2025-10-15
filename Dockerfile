# syntax=docker/dockerfile:1

# --- Build stage: compile the Vue app with Vite ---
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS build

WORKDIR /app

# Install dependencies first (better layer cache)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts ./
# Vite requires index.html at project root during build
COPY index.html ./
COPY public ./public
COPY src ./src

# Build-time API base URL (will be baked into the static bundle)
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=${VITE_API_BASE}

# Build the app
RUN npm run build

# --- Runtime stage: serve static files with Nginx ---
FROM nginx:1.27-alpine AS runtime

# Copy our nginx config (SPA friendly)
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Default command provided by nginx image