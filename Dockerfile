FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm install --omit=dev && npm cache clean --force && apk del python3 make g++

COPY --from=builder /app/dist ./dist
COPY serve.mjs ./serve.mjs

EXPOSE 8080
CMD ["node", "serve.mjs"]
