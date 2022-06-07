# Get video url by streamer id, time

streamerId에 해당하는 top word 반환

URL: `/video/:streamerId/:time`  
Method: `GET`

## 성공 시

Status: `200 OK`  
Content:
```text
https://www.twitch.tv/videos/1496727842?t=2h51m44s
```

## 실패 시

Condition: twitch 다시보기 동영상이 없는 경우  
Status: `200 OK`  
Content-Type: `text/plain`  
Content: `Can't found video`
