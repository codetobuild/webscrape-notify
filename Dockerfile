FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
RUN mkdir -p logs

EXPOSE 3009

CMD ["node", "src/index.js"]


