package services

import (
	"database/sql"
	"tchatong.info/db"
	"tchatong.info/models"
)

func GetAllStreamer(mariaDB *db.MariaDB) []models.Streamer {
	streamerList := make([]models.Streamer, 0)
	res, err := mariaDB.Query("SELECT * FROM streamer")
	defer func(res *sql.Rows) {
		_ = res.Close()
	}(res)
	if err != nil {
		return streamerList
	}
	for res.Next() {
		var streamer models.Streamer
		err := res.Scan(&streamer.Id, &streamer.StreamerId, &streamer.StreamerLogin, &streamer.Nick, &streamer.ImageUrl, &streamer.OnAir, &streamer.Viewers, &streamer.Followers)
		if err != nil {
			return streamerList
		}
		streamerList = append(streamerList, streamer)
	}
	return streamerList
}

func GetOneStreamer(streamerId string, mariaDB *db.MariaDB) models.Streamer {
	var streamer models.Streamer
	err := mariaDB.QueryRow("SELECT * FROM streamer WHERE streamer_id=?", streamerId).Scan(&streamer.Id, &streamer.StreamerId, &streamer.StreamerLogin, &streamer.Nick, &streamer.ImageUrl, &streamer.OnAir, &streamer.Viewers, &streamer.Followers)
	if err != nil {
		return models.Streamer{}
	}
	return streamer
}
