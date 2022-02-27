FROM node:12-alpine

LABEL vendor="kronov.net"
LABEL maintainer="info@kronova.net"

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "index.js" ]