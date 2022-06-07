package services

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"os"
	"strconv"
	"tchatong.info/models"
	"tchatong.info/utils"
	"time"
)

var twitchAccessToken string
var twitchClientId string

func init() {
	twitchAccessToken = os.Getenv("TWITCH_API_ACCESS_TOKEN")
	twitchClientId = os.Getenv("TWITCH_API_CLIENT_ID")
}

// parseDuration
// 13h21m13s 형태의 duration 문자열을 파싱하는 함수
func parseDuration(duration string) (int, int, int) {
	split := utils.SplitMulti(duration, "hms")
	if len(split) <= 0 {
		return 0, 0, 0
	}
	if len(split) == 1 {
		sec, err := strconv.ParseInt(split[0], 10, 64)
		if err != nil {
			return 0, 0, 0
		}
		return 0, 0, int(sec)
	}
	if len(split) == 2 {
		min, err := strconv.ParseInt(split[0], 10, 64)
		sec, err := strconv.ParseInt(split[1], 10, 64)
		if err != nil {
			return 0, 0, 0
		}
		return 0, int(min), int(sec)
	}
	if len(split) == 3 {
		hour, err := strconv.ParseInt(split[0], 10, 64)
		min, err := strconv.ParseInt(split[1], 10, 64)
		sec, err := strconv.ParseInt(split[2], 10, 64)
		if err != nil {
			return 0, 0, 0
		}
		return int(hour), int(min), int(sec)
	}
	return 0, 0, 0
}

// getVideos
// twitch helix API로부터 다시보기 정보를 가져오는 함수
func getVideos(streamerId string) models.VideoInfo {
	var videoInfo models.VideoInfo

	url := fmt.Sprintf("https://api.twitch.tv/helix/videos?user_id=%s", streamerId)
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", twitchAccessToken))
	req.Header.Set("Client-Id", twitchClientId)
	res, _ := client.Do(req)
	err := json.NewDecoder(res.Body).Decode(&videoInfo)
	if err != nil {
		panic(err)
	}
	return videoInfo
}

// GoToVideo
// streamerId, stringTime(UNIX millisecond timestamp)을 기준으로 다시보기 링크를 반환하는 함수
func GoToVideo(streamerId string, stringTime string) string {
	var videoInfo models.VideoInfo
	var targetTime time.Time

	videoInfo = getVideos(streamerId)
	targetTime, _ = utils.ParseUnixTime(stringTime)
	for _, data := range videoInfo.Data {
		durationHour, durationMinute, durationSecond := parseDuration(data.Duration)
		if durationHour == 0 && durationMinute == 0 && durationSecond == 0 {
			return "Can't found video"
		}
		endAt := data.CreatedAt.Add(time.Hour*time.Duration(durationHour) + time.Minute*time.Duration(durationMinute) + time.Second*time.Duration(durationSecond))
		if data.CreatedAt.Before(targetTime) && endAt.After(targetTime) {
			interval := targetTime.Unix() - data.CreatedAt.Unix()
			hour := math.Floor(float64(interval) / (60 * 60))
			interval = interval % (60 * 60)
			min := math.Floor(float64(interval) / (60))
			interval = interval % (60)
			sec := math.Floor(float64(interval))
			return fmt.Sprintf("%s?t=%dh%dm%ds", data.URL, int(hour), int(min), int(sec))
		}
	}
	return "Can't found video"
}
