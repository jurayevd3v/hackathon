# 1. Build bosqichi 
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Production image 
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
# wait-port ni global o'rnatish
RUN npm install -g wait-port
EXPOSE 6000
CMD ["node", "dist/main.js"]
