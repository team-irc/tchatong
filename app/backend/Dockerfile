FROM node:17-alpine3.12

WORKDIR /backend_init

COPY ./package.json /backend_init/package.json
COPY ./package-lock.json /backend_init/package-lock.json

RUN npm install

EXPOSE 3000