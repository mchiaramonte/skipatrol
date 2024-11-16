FROM node:18-alpine AS build
WORKDIR /tmp
COPY . /tmp/
RUN npm cache clean --force
RUN npm ci
RUN npm run build --prod
FROM node:18-alpine
WORKDIR /app
COPY --from=build /tmp/dist /app/dist
RUN npm install express cheerio cors
COPY --from=build /tmp/app.js /app/app.js
EXPOSE 3001
CMD ["node", "app.js"]


