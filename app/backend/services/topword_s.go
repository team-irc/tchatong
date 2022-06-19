package services

import (
	"tchatong.info/db"
	"tchatong.info/models"
)

func GetTopWord(streamerId string, mariaDB *db.MariaDB) models.TopWord {
	var topWord models.TopWord

	_ = mariaDB.QueryRow("SELECT * FROM topword WHERE streamer_id=?", streamerId).Scan(&topWord.Id, &topWord.StreamerId, &topWord.Date, &topWord.Top1, &topWord.Top2, &topWord.Top3, &topWord.Top4, &topWord.Top5, &topWord.Top6, &topWord.Top7, &topWord.Top8, &topWord.Top9, &topWord.Top10)
	return topWord
}
