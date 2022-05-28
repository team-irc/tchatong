package services

import (
	"tchatong.info/models"
)

func GetAllStreamer() []models.Streamer {
	streamerList := make([]models.Streamer, 0)
	res, err := db.Query("SELECT * FROM streamer")
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

func GetOneStreamer(streamerId string) models.Streamer {
	var streamer models.Streamer
	err := db.QueryRow("SELECT * FROM streamer WHERE streamer_id=?", streamerId).Scan(&streamer.Id, &streamer.StreamerId, &streamer.StreamerLogin, &streamer.Nick, &streamer.ImageUrl, &streamer.OnAir, &streamer.Viewers, &streamer.Followers)
	if err != nil {
		return models.Streamer{}
	}
	return streamer
}
