FROM node:20-alpine AS build
WORKDIR /opt/app
ADD *.json ./
RUN npm ci
ADD . .
RUN npm run generate
RUN npm run build

FROM node:lts-slim
WORKDIR /opt/app
ADD package*.json ./
RUN npm ci --omit=dev
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/assets ./assets
COPY --from=build /opt/app/prisma ./prisma
RUN npm run generate
RUN apt-get update -y && apt-get install -y openssl
CMD ["npm", "run", "start:prod"]
EXPOSE 3000
