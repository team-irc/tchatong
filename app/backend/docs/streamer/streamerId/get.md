# Show streamer by streamer id

streamerId와 일치하는 스트리머 데이터를 json 형식으로 반환

URL: `/streamer/:streamerId`  
Method: `GET`

## 성공 시

Status: `200 OK`  
Content:
```json
{
  "id": 6,
  "streamerId": "102900195",
  "streamerLogin": "109ace",
  "nick": "철면수심",
  "imageUrl": "https://static-cdn.jtvnw.net/jtv_user_pictures/109ace-profile_image-579a869e5635763f-70x70.png",
  "onAir": false,
  "viewers": 0,
  "followers": 201590
}
```
