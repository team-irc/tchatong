# twitch-chat-analyzer

트위치 채팅 분석기

---
## TODO
- [X] 매 1분마다 데이터 집계해서 저장하기
- [X] 파이썬에 DB 연결하기
- [X] 데이터 분석 후 다시 저장하기
- [ ] NLTK 라이브러리 사용해서 단어 수집하기
---
## BUILD
```
$ docker build . -t analyzer
```
---
## RUN
```
1. $ docker exec -it analyzer bash  
```
---
## ISSUES