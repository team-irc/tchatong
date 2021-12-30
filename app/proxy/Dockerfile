FROM alpine:3.12

RUN apk update
RUN apk add nginx

RUN mkdir /run/nginx
RUN adduser -D -g 'www' www
RUN mkdir /www
RUN chown -R www:www /var/lib/nginx
RUN chown -R www:www /www

ADD srcs/ssl /etc/nginx/ssl
ADD srcs/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443
