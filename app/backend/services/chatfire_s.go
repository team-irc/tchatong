package services

import (
	"database/sql"
	"tchatong.info/models"
	"tchatong.info/utils"
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

func GetEntireTopChatFire(streamerId string, db *sql.DB) models.ChatFireResponse {
	var date string
	var count int

	_ = db.QueryRow("SELECT date, count FROM chatfire WHERE id=(SELECT chatfire_id FROM legend WHERE streamer_id=?)", streamerId).Scan(&date, &count)
	return models.ChatFireResponse{Time: date, Count: count}
}

func GetDayTopChatFire(streamerId string, db *sql.DB) models.ChatFireResponse {
	var aDayAgo time.Time
	var dayTopChatFire models.ChatFire

	dayTopChatFire = models.ChatFire{}
	aDayAgo = time.Now().Add(time.Duration(-1) * time.Hour * 24)
	(func() {
		rows, _ := db.Query("SELECT * FROM chatfire WHERE streamer_id=? AND date >= ?", streamerId, aDayAgo)
		defer rows.Close()
		for rows.Next() {
			var chatFire models.ChatFire
			_ = rows.Scan(&chatFire.Id, &chatFire.StreamerId, &chatFire.Date, &chatFire.Count)
			if chatFire.Count >= dayTopChatFire.Count {
				dayTopChatFire = chatFire
			}
		}
	})()
	return models.ChatFireResponse{Time: dayTopChatFire.Date, Count: dayTopChatFire.Count}
}

func GetCurrentChatFire(streamerId string, db *sql.DB) models.ChatFireResponse {
	var chatFire models.ChatFire

	aMinuteAgo := time.Now().Add(time.Duration(-1) * time.Minute).Truncate(time.Minute)
	_ = db.QueryRow("SELECT * FROM chatfire WHERE streamer_id=? AND date=?", streamerId, aMinuteAgo).Scan(&chatFire.Id, &chatFire.StreamerId, &chatFire.Date, &chatFire.Count)
	return models.ChatFireResponse{Time: chatFire.Date, Count: chatFire.Count}
}

func GetChatFireByInterval(streamerId string, interval int, db *sql.DB) []models.ChatFireResponse {
	chatFireList := getChatFireList(streamerId, db)
	res := make([]models.ChatFireResponse, 60/interval*24)
	aDayAgo := time.Now().Add(time.Duration(-1) * time.Hour * 24).Truncate(time.Hour)
	for i := range res {
		res[i].Time = aDayAgo.Add(time.Minute * time.Duration(i*interval)).UTC().String()
		for _, chatFire := range chatFireList {
			chatFireTime, _ := utils.ParseTime(chatFire.Date)
			chatFire.Date = time.Date(chatFireTime.Year(), chatFireTime.Month(), chatFireTime.Day(), chatFireTime.Hour(), (chatFireTime.Minute()/interval)*interval, chatFireTime.Second(), chatFireTime.Nanosecond(), chatFireTime.Location()).String()
			if res[i].Time == chatFire.Date {
				res[i].Count += chatFire.Count
			}
		}
	}
	return res
}
