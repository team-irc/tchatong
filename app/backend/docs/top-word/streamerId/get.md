# Show top word by streamer id

streamerId에 해당하는 top word 반환

URL: `/top-word/:streamerId`  
Method: `GET`

## 성공 시

Status: `200 OK`  
Content:
```json
{
  "id": 1,
  "streamerId": "66375105",
  "date": "2022-05-30 06:06:44",
  "top1": "ㅋㅋㅋ",
  "top2": "스타",
  "top3": "또",
  "top4": "?",
  "top5": "바조",
  "top6": "호아킨",
  "top7": "골",
  "top8": "바",
  "top9": "축구인",
  "top10": "인스타"
}
```
