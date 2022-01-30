FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY front/package.json front/yarn.lock ./
RUN rm -rf node_modules && yarn install --frozen-lockfile


FROM node:alpine AS front_builder
WORKDIR /app
COPY front .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn run build


FROM node:alpine
WORKDIR /app
COPY ./server .
RUN rm -rf node_modules && yarn install --frozen-lockfile
COPY --from=front_builder /app/out /app/staticDir
RUN yarn run build
EXPOSE 8080
ENTRYPOINT ["yarn","run","start"]