# Show all streamers

모든 스트리머 데이터를 json 형식으로 반환

URL: `/streamer`  
Method: `GET`

## 성공 시

Status: `200 OK`  
Content:
```json
{
  "streamerList": [
    {
      "id": 6,
      "streamerId": "102900195",
      "streamerLogin": "109ace",
      "nick": "철면수심",
      "imageUrl": "https://static-cdn.jtvnw.net/jtv_user_pictures/109ace-profile_image-579a869e5635763f-70x70.png",
      "onAir": false,
      "viewers": 0,
      "followers": 201590
    },
    {
      "id": 17,
      "streamerId": "103825127",
      "streamerLogin": "hanryang1125",
      "nick": "풍월량",
      "imageUrl": "https://static-cdn.jtvnw.net/jtv_user_pictures/hanryang1125-profile_image-58261d78af47d249-70x70.jpeg",
      "onAir": false,
      "viewers": 0,
      "followers": 581330
    },
    {
      "id": 19,
      "streamerId": "103991968",
      "streamerLogin": "naseongkim",
      "nick": "김나성",
      "imageUrl": "https://static-cdn.jtvnw.net/jtv_user_pictures/ea777be2-7415-4ef2-8512-20083e08e9db-profile_image-70x70.png",
      "onAir": false,
      "viewers": 0,
      "followers": 132924
    }
  ]
}
```
