# twitch-chat-crawler

트위치 채팅 분석을 위한 채팅 수집기
---
## TODO
- [X] PING 메세지 응답해서 연결 끊어지지 않게 수정
- [ ] 에러처리부분 개선하기
- [ ] UTF8 관련 문제 해결하기
- [ ] SQL Injection 막기
- [ ] 채널을 추가 할 수 있는 API 추가 (socket server 구현)
- [X] DB 연결 (라이브러리 알아보기)
- [X] 채널 데이터 파싱 후 DB에 저장

---
## BUILD
```
$ docker build . -t crawler
```
---
## RUN
```
1. $ docker exec -it crawler sh  
```
---
## ISSUES
문제: clang++: Operation not permitted
원인: github.com/docker-library/php/issues/1177
해결: 알파인 버전을 3.14에서 3.13으로 낮춰서 해결 
---
문제: 실행중
```
terminate called without an active exception
Aborted
```
메세지와 함께 프로그램이 종료되는 문제
원인: 쓰레드가 위의 while문 때문에 join되지 못해서 발생한 문제
참고: https://stackoverflow.com/questions/7381757/c-terminate-called-without-an-active-exception
해결: while문 위에서 detach를 사용해 해결
---
문제: C++ MySQL Connector 라이브러리 사용시 헤더를 못찾는 문제

---
문제: db에 데이터 입력시 Incorrect string value: '\xF0\x9F\x91\x8D\xF0\x9F...' 에러 발생

---
문제: sql 쿼리시 문자열에 특수문자가 포함되는경우 에러가 남