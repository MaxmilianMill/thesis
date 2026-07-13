# ---- Stage 1: Build ----
# Use glibc-based image so native tailwindcss binaries resolve correctly
FROM node:22 AS builder
WORKDIR /app

# Vite replaces import.meta.env.* at build time, so these must be ARGs
ARG VITE_SERVER_URL=http://localhost:8080/api/v1
ARG VITE_WS_SERVER_URL=ws://localhost:8080/ws/chat
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_WS_SERVER_URL=$VITE_WS_SERVER_URL

# Install dependencies (mirrors the server Dockerfile pattern)
COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/
COPY client/package.json ./client/

RUN npm install --workspace=packages/types --workspace=client --include-workspace-root

COPY packages/types/ ./packages/types/
COPY client/ ./client/

RUN npm run build --workspace=packages/types
RUN npm run build --workspace=client

# ---- Stage 2: Serve static files with nginx ----
FROM nginx:alpine AS runner
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
