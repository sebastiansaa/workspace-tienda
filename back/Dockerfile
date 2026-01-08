FROM node:22-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copiar el código y compilar
COPY . .
# Generate Prisma client for the target linux runtime inside the builder
RUN npx prisma generate

RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copiar dependencias y build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
