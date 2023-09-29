FROM node:18-alpine
WORKDIR /app
COPY dist /app/dist
COPY package.json /app/
COPY package-lock.json /app/
COPY app.js /app/
RUN npm ci
CMD ["node", "app.js"]
EXPOSE 3001


