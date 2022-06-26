# Show top word by streamer id

streamerId에 해당하는 top word 반환

URL: `/top-word/:streamerId`  
Method: `GET`

## 성공 시

Status: `200 OK`  
Content:
```json
{
  "id": 5,
  "streamerId": "66375105",
  "date": "2022-06-20 06:55:55",
  "top1": "ㅋㅋㅋ",
  "top1Count": 0,
  "top2": "하다",
  "top2Count": 0,
  "top3": "맨",
  "top3Count": 0,
  "top4": "ㄷㄷ",
  "top4Count": 0,
  "top5": "이",
  "top5Count": 0,
  "top6": "권",
  "top6Count": 0,
  "top7": "개",
  "top7Count": 0,
  "top8": "오",
  "top8Count": 0,
  "top9": "ㅋㅋ",
  "top9Count": 0,
  "top10": "왜",
  "top10Count": 0
}
```
