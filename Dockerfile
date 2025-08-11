# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json ./

# Create directories for apps and packages
RUN mkdir -p apps/web apps/garment apps/pharmacy packages/shared packages/ui

# Copy package.json files
COPY apps/web/package.json ./apps/web/
COPY apps/garment/package.json ./apps/garment/
COPY apps/pharmacy/package.json ./apps/pharmacy/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build all applications
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/garment/public ./apps/garment/public
COPY --from=builder /app/apps/pharmacy/public ./apps/pharmacy/public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]

# Development stage
FROM base AS development
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./

# Create directories for apps and packages
RUN mkdir -p apps/web apps/garment apps/pharmacy packages/shared packages/ui

# Copy package.json files
COPY apps/web/package.json ./apps/web/
COPY apps/garment/package.json ./apps/garment/
COPY apps/pharmacy/package.json ./apps/pharmacy/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]
