# build stage
FROM node:18-alpine AS builder

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --no-frozen-lockfile

COPY . .

RUN pnpm run build


# production stage
FROM node:18-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=builder /app/.next/ ./.next/
COPY --from=builder /app/public/ ./public/
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

RUN npm i -g pnpm && pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]
