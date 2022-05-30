package services

import (
	"database/sql"
	"tchatong.info/models"
	"time"
)

func getChatFireList(streamerId string, db *sql.DB) []models.ChatFire {
	chatFireList := make([]models.ChatFire, 0)
	res, err := db.Query("SELECT * FROM chatfire WHERE streamer_id=? AND date > now() - INTERVAL 1 DAY", streamerId)
	defer res.Close()
	if err != nil {
		return nil
	}
	for res.Next() {
		var chatFire models.ChatFire
		err := res.Scan(&chatFire.Id, &chatFire.StreamerId, &chatFire.Date, &chatFire.Count)
		if err != nil {
			return chatFireList
		}
		chatFireList = append(chatFireList, chatFire)
	}
	return chatFireList
}

// day top
// entire top
// current

func GetCurrentChatFire(streamerId string, db *sql.DB) models.ChatFireResponse {
	var chatFire models.ChatFire

	aMinuteAgo := time.Now().Add(time.Duration(-1) * time.Minute).Truncate(time.Minute)
	_ = db.QueryRow("SELECT * FROM chatfire WHERE streamer_id=? AND date=?", streamerId, aMinuteAgo).Scan(&chatFire.Id, &chatFire.StreamerId, &chatFire.Date, &chatFire.Count)
	return models.ChatFireResponse{Time: chatFire.Date, Count: chatFire.Count}
}

func GetChatFireByInterval(streamerId string, interval int, db *sql.DB) []models.ChatFireResponse {
	chatFireList := getChatFireList(streamerId, db)
	res := make([]models.ChatFireResponse, 0)
	for _, chatFire := range chatFireList {
		chatFireTime, _ := time.Parse("2006-01-02 15:04:05", chatFire.Date)
		var minute = (chatFireTime.Minute() / interval) * interval
		chatFire.Date = time.Date(chatFireTime.Year(), chatFireTime.Month(), chatFireTime.Day(), chatFireTime.Hour(), minute, chatFireTime.Second(), chatFireTime.Nanosecond(), chatFireTime.Location()).String()
		if len(res) == 0 {
			res = append(res, models.ChatFireResponse{Time: chatFire.Date, Count: chatFire.Count})
		} else {
			var contain = false
			for i, a := range res {
				if a.Time == chatFire.Date {
					res[i].Count += chatFire.Count
					contain = true
				}
			}
			if !contain {
				res = append(res, models.ChatFireResponse{Time: chatFire.Date, Count: chatFire.Count})
			}
		}
	}
	return res
}
