# Dockerfile
FROM jarredsumner/bun:edge

WORKDIR /app

# Kopiere package.json & installiere deps
COPY package.json ./
RUN bun install

# Kopiere restlichen Code
COPY . .

# Prisma Client generieren
RUN bun prisma generate

# Standard CMD (wird von docker-compose überschrieben)
CMD ["bun", "run", "rest"]