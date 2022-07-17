package daemons

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"
	"tchatong.info/db"
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

func getImageUrl(streamerId string) (string, error) {
	var userInfo models.UserInfo

	url := fmt.Sprintf("https://api.twitch.tv/helix/users?id=%s", streamerId)
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", twitchAccessToken))
	req.Header.Set("Client-Id", twitchClientId)
	res, _ := client.Do(req)
	err := json.NewDecoder(res.Body).Decode(&userInfo)
	if err != nil {
		panic(err)
	}
	if len(userInfo.Data) <= 0 {
		return "", nil
	}
	return userInfo.Data[0].ProfileImageURL, nil
}

func UpdateStreamerTable(mariaDB *db.MariaDB, redis *db.RedisDB) {
	for {
		start := time.Now()
		(func() {
			rows, err := mariaDB.Query("SELECT streamer_id FROM streamer")
			defer func(rows *sql.Rows) {
				_ = rows.Close()
			}(rows)
			if err != nil {
				_ = fmt.Errorf(err.Error())
			}
			wg := sync.WaitGroup{}
			for rows.Next() {
				var streamerId string
				err := rows.Scan(&streamerId)
				if err != nil {
					_ = fmt.Errorf(err.Error())
				}
				wg.Add(1)
				go (func(streamerId string) {
					defer wg.Done()
					onAir, viewers := getOnAirAndViewers(streamerId)
					followers := getFollowers(streamerId)
					imageUrl, err := getImageUrl(streamerId)
					if err != nil {
						return
					}
					redis.Set("streamer:viewers:"+streamerId, viewers, 2*time.Minute)
					(func() {
						res, _ := mariaDB.Query("UPDATE streamer SET image_url=?, on_air=?, viewers=?, followers=? WHERE streamer_id=?", imageUrl, onAir, viewers, followers, streamerId)
						defer func(res *sql.Rows) {
							_ = res.Close()
						}(res)
					})()
					if err != nil {
						_ = fmt.Errorf(err.Error())
					}
				})(streamerId)
			}
			wg.Wait()
		})()
		end := time.Since(start)
		println(fmt.Sprintf("[%s]: streamer table update (wasted time: %s)", time.Now().Truncate(time.Second).Local(), end))
		time.Sleep(time.Minute)
	}
}
