# ---------- BASE IMAGE ----------
FROM node:20-alpine AS base
WORKDIR /app

# Needed for lightningcss / tailwind / turbopack
RUN apk add --no-cache python3 make g++

# ---------- INSTALL PNPM ----------
FROM base AS pnpm_installer
RUN npm install -g pnpm

# ---------- DEPENDENCIES ----------
FROM pnpm_installer AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- BUILDER ----------
FROM pnpm_installer AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for Next.js public env vars
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

RUN pnpm build

# ---------- PRODUCTION IMAGE ----------
FROM base AS production
WORKDIR /app

# Create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install pnpm in production
RUN npm install -g pnpm

# Copy necessary files
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "start"]
