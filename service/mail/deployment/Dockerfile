FROM node:16.13.1-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
ENV MAIL_FROM_NAME "Test Source"
ENV MAIL_FROM_EMAIL "test@gmail.com"
ENV MAIL_JET_KEY "a9a6607039bb1cc9b7942f90117c867b"
ENV MAIL_JET_SECRET "2fbe8b732a47b0ab174e6810ed61f9a1"
ENV SMTP_HOST "smtp.ethereal.email"
ENV SMTP_PORT "587"
ENV SMTP_USERNAME "l4spet4dpcnb6mh2@ethereal.email"
ENV SMTP_PASSWORD "YmAkUFKFJ3mJ3u1R8q"

ENV SERVICE_USER "user-service:12000"
ENV SERVICE_MAIL "0.0.0.0:12001"

EXPOSE 12001
CMD [ "node", "app.js" ]