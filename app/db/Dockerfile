FROM alpine:3.14

RUN apk update
RUN apk add mysql mysql-client

ADD srcs/mariadb-server.cnf /etc/my.cnf.d/mariadb-server.cnf
COPY ./srcs/init_db.sql /dbconfig/init_db.sql

# mysql 소켓 기본경로. 만들어주지 않으면 실행시 에러
RUN mkdir /run/mysqld

RUN mysql_install_db --user=root --datadir=/var/lib/mysql

RUN mysqld --user=root --bootstrap --verbose=0 < /dbconfig/init_db.sql

EXPOSE 3306