FROM node:17-alpine3.12

WORKDIR /frontend_init

COPY ./package.json /frontend_init/package.json
COPY ./package-lock.json /frontend_init/package-lock.json

RUN npm i

EXPOSE 4000
