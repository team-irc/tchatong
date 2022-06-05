package services

import (
	"database/sql"
	"tchatong.info/models"
)

func GetTopWord(streamerId string, db *sql.DB) models.TopWord {
	var topWord models.TopWord

	_ = db.QueryRow("SELECT * FROM topword WHERE streamer_id=?", streamerId).Scan(&topWord.Id, &topWord.StreamerId, &topWord.Date, &topWord.Top1, &topWord.Top2, &topWord.Top3, &topWord.Top4, &topWord.Top5, &topWord.Top6, &topWord.Top7, &topWord.Top8, &topWord.Top9, &topWord.Top10)
	return topWord
}
