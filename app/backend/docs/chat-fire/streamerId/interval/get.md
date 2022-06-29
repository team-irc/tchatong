# Show chat fire by streamer id and interval

streamerId와 일치하는 스트리머의 채팅 화력 데이터를 interval에 맞게 가공해서 반환함
시간은 KST 기준으로 반환함(+0900)

URL: `/chat-fire/:streamerId/:interval`  
Method: `GET`

## 성공 시

Status: `200 OK`  
Content:
```json
[
  {
    "time": "2022-05-30T06:00:00",
    "count": 689
  },
  {
    "time": "2022-05-30T06:15:00",
    "count": 985
  },
  {
    "time": "2022-05-30T06:30:00",
    "count": 2361
  },
  {
    "time": "2022-05-30T06:45:00",
    "count": 1196
  },
  {
    "time": "2022-05-30T07:00:00",
    "count": 701
  }
]
```
## 실패 시

Condition: interval이 1보다 작거나 60보다 큰 경우  
Status: `400 Bad Request`  
Content-Type: `text/plain`  
Content: `interval < 1 || interval > 60`  

**or**

Condition: interval이 수가 아닌 경우  
Status: `400 Bad Request`  
Content-Type `text/plain`  
Content: `interval should be number`  
