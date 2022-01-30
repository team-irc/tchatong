FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y make \
                       cmake \
                       g++ \
                       libmysqlcppconn-dev \
                       libboost-all-dev \
                       libmysqlclient-dev

COPY ./ /crawler

WORKDIR /crawler