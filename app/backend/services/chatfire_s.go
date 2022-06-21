package services

import (
	"database/sql"
	"fmt"
	"tchatong.info/db"
	"tchatong.info/models"
	"tchatong.info/utils"
	"time"
)

func getChatFireList(streamerId string, mariaDB *db.MariaDB) []models.ChatFire {
	chatFireList := make([]models.ChatFire, 0)
	res, err := mariaDB.Query("SELECT * FROM chatfire WHERE streamer_id=? AND date > now() - INTERVAL 1 DAY", streamerId)
	defer func(res *sql.Rows) {
		err := res.Close()
		if err != nil {
			_ = fmt.Errorf(err.Error())
		}
	}(res)
	if err != nil {
		return nil
	}
	for res.Next() {
		var chatFire models.ChatFire
		var viewers sql.NullInt64
		err := res.Scan(&chatFire.Id, &chatFire.StreamerId, &chatFire.Date, &chatFire.Count, &viewers)
		if err != nil {
			_ = fmt.Errorf(err.Error())
			return chatFireList
		}
		chatFire.Viewers = int(viewers.Int64)
		chatFireList = append(chatFireList, chatFire)
	}
	return chatFireList
}

func GetEntireTopChatFire(streamerId string, mariaDB *db.MariaDB) models.ChatFireResponse {
	var res models.ChatFireResponse
	var viewers sql.NullInt64

	_ = mariaDB.QueryRow("SELECT date, count, viewers FROM chatfire WHERE id=(SELECT chatfire_id FROM legend WHERE streamer_id=?)", streamerId).Scan(&res.Time, &res.Count, &viewers)
	res.Viewers = int(viewers.Int64)
	return res
}

func GetDayTopChatFire(streamerId string, mariaDB *db.MariaDB) models.ChatFireResponse {
	var aDayAgo time.Time
	var dayTopChatFire models.ChatFire

	dayTopChatFire = models.ChatFire{}
	aDayAgo = time.Now().Add(time.Duration(-1) * time.Hour * 24)
	(func() {
		rows, _ := mariaDB.Query("SELECT * FROM chatfire WHERE streamer_id=? AND date >= ?", streamerId, aDayAgo)
		defer func(rows *sql.Rows) {
			err := rows.Close()
			if err != nil {
				_ = fmt.Errorf(err.Error())
			}
		}(rows)
		for rows.Next() {
			var chatFire models.ChatFire
			var viewers sql.NullInt64
			_ = rows.Scan(&chatFire.Id, &chatFire.StreamerId, &chatFire.Date, &chatFire.Count, &viewers)
			chatFire.Viewers = int(viewers.Int64)
			if chatFire.Count >= dayTopChatFire.Count {
				dayTopChatFire = chatFire
			}
		}
	})()
	return models.ChatFireResponse{Time: dayTopChatFire.Date, Count: dayTopChatFire.Count}
}

func GetCurrentChatFire(streamerId string, mariaDB *db.MariaDB) models.ChatFireResponse {
	var chatFire models.ChatFire

	aMinuteAgo := time.Now().Add(time.Duration(-1) * time.Minute).Truncate(time.Minute)
	_ = mariaDB.QueryRow("SELECT * FROM chatfire WHERE streamer_id=? AND date=?", streamerId, aMinuteAgo).Scan(&chatFire.Id, &chatFire.StreamerId, &chatFire.Date, &chatFire.Count)
	return models.ChatFireResponse{Time: chatFire.Date, Count: chatFire.Count}
}

func GetChatFireByInterval(streamerId string, interval int, mariaDB *db.MariaDB) []models.ChatFireResponse {
	chatFireList := getChatFireList(streamerId, mariaDB)
	res := make([]models.ChatFireResponse, 60/interval*24+1)
	aDayAgo := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), time.Now().Hour(), time.Now().Minute()/interval*interval, 0, 0, time.Now().Location()).Add(time.Duration(-1) * time.Hour * 24)
	for i := range res {
		res[i].Time = aDayAgo.Add(time.Minute * time.Duration(i*interval)).UTC().String()
		var divCount int = 0
		for _, chatFire := range chatFireList {
			chatFireTime, _ := utils.ParseTime(chatFire.Date)
			chatFire.Date = time.Date(chatFireTime.Year(), chatFireTime.Month(), chatFireTime.Day(), chatFireTime.Hour(), (chatFireTime.Minute()/interval)*interval, chatFireTime.Second(), chatFireTime.Nanosecond(), chatFireTime.Location()).String()
			if res[i].Time == chatFire.Date {
				res[i].Count += chatFire.Count
				res[i].Viewers += chatFire.Viewers
				divCount += 1
			}
		}
		res[i].Count /= divCount
		res[i].Viewers /= divCount
	}
	return res
}
