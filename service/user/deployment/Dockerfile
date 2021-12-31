FROM node:16.13.1-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
ENV JWT_KEY "^$gds#gkl3n2kk6$#YFS32"
ENV MONGO_USERNAME "test-user"
ENV MONGO_PASSWORD "Test1234"
ENV MONGO_HOST "dds-zf8ee6fabd538ea41916-pub.mongodb.kualalumpur.rds.aliyuncs.com:3717"
# ENV MONGO_PASSWORD "Admin123"
# ENV MONGO_HOST "obright.qz7zf.mongodb.net"
ENV MONGO_DB "test"
ENV SERVICE_MAIL_CLIENT "SMTP"
ENV SERVICE_USER "0.0.0.0:12000"
ENV SERVICE_MAIL "mail-service:12001"

EXPOSE 12000
CMD [ "node", "app.js" ]