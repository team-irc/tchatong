FROM alpine:3.12

RUN apk update && apk add telegraf

COPY ./telegraf.conf /etc/telegraf/telegraf.conf