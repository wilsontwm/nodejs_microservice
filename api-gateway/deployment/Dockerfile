FROM node:16.13.1-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
ENV PORT 3000
ENV SERVICE_USER "user-service:12000"
ENV SERVICE_MAIL "mail-service:12001"

EXPOSE 3000
CMD [ "node", "server.js" ]