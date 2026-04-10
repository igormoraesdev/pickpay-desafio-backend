FROM oven/bun:latest AS build

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .
RUN bun run build

FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --production

COPY --from=build /app/dist ./dist

EXPOSE 9090

CMD ["bun", "run", "dist/main.js"]
