# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (cache optimization)
COPY package*.json ./

RUN npm ci

# Copy source
COPY . .

# Build NestJS
RUN npm run build


# ---------- Stage 2: Runtime ----------
FROM node:20-alpine

WORKDIR /app

# Copy only runtime artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

# ---- HEALTH CHECK (READINESS, NOT LIVENESS) ----
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
