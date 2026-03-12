# Dockerfile
FROM oven/bun:1
WORKDIR /app
COPY package.json /app
COPY bun.lock /app
RUN bun install
COPY packages/database/prisma /app/prisma
RUN bunx prisma generate
COPY . .
CMD ["bun", "app/rest/src/modules/todos/index.ts"]