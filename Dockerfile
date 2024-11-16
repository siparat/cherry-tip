FROM node:20-alpine AS build
WORKDIR /opt/app
ADD *.json ./
RUN npm ci --legacy-peer-deps
ADD . .
RUN npm run generate
RUN npm run build

FROM node:20-alpine
WORKDIR /opt/app
ADD package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/assets ./assets
COPY --from=build /opt/app/prisma ./prisma
RUN npm run generate
CMD ["npm", "run", "start:prod"]
EXPOSE 3000
