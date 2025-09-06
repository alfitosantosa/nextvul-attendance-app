# Base image untuk build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json dan lock file dulu
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Prisma generate (untuk client)
# RUN npx prisma generate

# Deploy migrations (mirip dengan vercel build command)
RUN npx prisma migrate deploy

# Build Next.js
RUN npm run build

# --- Production image ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Hanya copy hasil build dan file penting
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Prisma Client tetap dibutuhkan di runtime
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
