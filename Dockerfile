# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Stage 2: Build the Next.js application
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js (reads .env if present for NEXT_PUBLIC_ vars)
RUN npm run build

# Stage 3: Production runner environment
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3004

# Create a non-root system user for safety
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built assets and dependencies. Runtime secrets are injected by Compose;
# they must not be baked into an image layer.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Set correct ownership for Next.js runtime directories
RUN chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3004

CMD ["npm", "run", "start"]
