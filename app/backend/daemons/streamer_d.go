package daemons

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"tchatong.info/models"
	"time"
)

var twitchAccessToken string
var twitchClientId string

func init() {
	twitchAccessToken = os.Getenv("TWITCH_API_ACCESS_TOKEN")
	twitchClientId = os.Getenv("TWITCH_API_CLIENT_ID")
}

func getOnAirAndViewers(streamerId string) (bool, int) {
	var onAir bool
	var viewers int
	var streamingInfo models.StreamingInfo

	url := fmt.Sprintf("https://api.twitch.tv/helix/streams?user_id=%s", streamerId)
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", twitchAccessToken))
	req.Header.Set("Client-Id", twitchClientId)
	res, _ := client.Do(req)
	err := json.NewDecoder(res.Body).Decode(&streamingInfo)
	if err != nil {
		panic(err)
	}
	onAir = len(streamingInfo.Data) >= 1
	if onAir {
		viewers = streamingInfo.Data[0].ViewerCount
	} else {
		viewers = 0
	}
	return onAir, viewers
}

func getFollowers(streamerId string) int {
	var followerInfo models.FollowerInfo

	url := fmt.Sprintf("https://api.twitch.tv/helix/users/follows?to_id=%s", streamerId)
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", twitchAccessToken))
	req.Header.Set("Client-Id", twitchClientId)
	res, _ := client.Do(req)
	err := json.NewDecoder(res.Body).Decode(&followerInfo)
	if err != nil {
		panic(err)
	}
	return followerInfo.Total
}

func OverWatchStreamerTable(db *sql.DB) {
	for {
		(func() {
			res, err := db.Query("SELECT streamer_id FROM streamer")
			defer res.Close()
			if err != nil {
				_ = fmt.Errorf(err.Error())
			}
			for res.Next() {
				var streamerId string
				err := res.Scan(&streamerId)
				if err != nil {
					_ = fmt.Errorf(err.Error())
				}
				onAir, viewers := getOnAirAndViewers(streamerId)
				followers := getFollowers(streamerId)
				(func() {
					res, err = db.Query("UPDATE streamer SET on_air=?, viewers=?, followers=? WHERE streamer_id=?", onAir, viewers, followers, streamerId)
					defer res.Close()
				})()
				if err != nil {
					_ = fmt.Errorf(err.Error())
				}
			}
			println(fmt.Sprintf("[%s]: streamer table update", time.Now().Truncate(time.Second).Local()))
		})()
		time.Sleep(time.Minute)
	}
}
