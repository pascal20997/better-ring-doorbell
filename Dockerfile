FROM node:12-alpine

LABEL vendor="kronova.net"
LABEL maintainer="info@kronova.net"

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "index.js" ]