FROM ubuntu:18.04

# Install Python

RUN apt update

RUN apt install -y software-properties-common

RUN add-apt-repository -y ppa:deadsnakes/ppa

RUN apt update

RUN apt install -y python3.8

# Install KoNLPy

RUN apt-get update

RUN apt-get install -y g++ openjdk-8-jdk python3-dev python3-pip curl

RUN python3 -m pip install --upgrade pip

RUN python3 -m pip install konlpy

# Fix when import konlpy 
# module 'tweepy' has no attribute 'StreamListener' error

RUN python3 -m pip install tweepy==3.10.0

# Install MySQL Client

RUN python3 -m pip install PyMySQL

# Install Redis Client

RUN python3 -m pip install redis

RUN python3 -m pip install pandas

# Install Locale

RUN apt-get update && apt-get install -y locales

RUN locale-gen ko_KR.UTF-8

ENV LC_ALL ko_KR.UTF-8
