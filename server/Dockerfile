# ---- Stage 1: Build ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/
COPY server/package.json ./server/

RUN npm install --workspace=packages/types --workspace=server \
    --include-workspace-root

COPY packages/types/ ./packages/types/
COPY server/ ./server/

RUN npm run build --workspace=packages/types
RUN npm run build --workspace=server

# ---- Stage 2: Production image ----
FROM node:22-alpine AS runner
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/
COPY server/package.json ./server/

RUN npm install --workspace=packages/types --workspace=server \
    --include-workspace-root --omit=dev

COPY --from=builder /app/packages/types/dist \
./packages/types/dist
COPY --from=builder /app/server/dist ./server/dist

ENV NODE_ENV=production
EXPOSE 8080

WORKDIR /app/server
CMD ["node", "dist/index.js"]