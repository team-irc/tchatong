package daemons

import (
	"database/sql"
	"fmt"
	"github.com/gempir/go-twitch-irc/v3"
	"log"
	"tchatong.info/db"
	"tchatong.info/models"
	"time"
)

func contains[T comparable](s []T, e T) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

/**
 * @author  amateur.toss@gmail.com
 * @details 10초마다 streamer 테이블이 변경되었는지 감시하는 함수
 */
func overWatchStreamerList(mariaDB *db.MariaDB, ch chan string) {
	var streamerList []string
	for {
		res, err := mariaDB.Query("SELECT streamer_login FROM streamer")
		if err != nil {
			panic(err)
		}
		for res.Next() {
			var streamer string
			err := res.Scan(&streamer)
			if err != nil {
				log.Fatal(err)
			}
			if !contains(streamerList, streamer) {
				streamerList = append(streamerList, streamer)
				ch <- streamer
			}
		}
		time.Sleep(time.Second * 10) // sleep for 10 sec
	}
}

/**
 * @author  amateur.toss@gmail.com
 * @details	지정된 채널로부터 채팅로그를 수집, db에 저장하는 함수
 */
func crawlFromChannel(channel string, mariaDB *db.MariaDB, bigQueryDB *db.BigQuery) {
	client := twitch.NewAnonymousClient()
	client.OnPrivateMessage(func(message twitch.PrivateMessage) {
		if len(message.Message) >= 256 {
			return
		}
		bigQueryDB.InsertRow(models.ChatLog{StreamerId: message.RoomID, StreamerLogin: message.Channel, Date: time.Now().UTC(), Content: message.Message})
		conn, err := mariaDB.Query("INSERT INTO chatlog VALUES (?, ?, ?)", message.RoomID, time.Now().UTC(), message.Message)
		defer func(conn *sql.Rows) {
			err := conn.Close()
			if err != nil {
				_ = fmt.Errorf(err.Error())
			}
		}(conn)
		if err != nil {
			_ = fmt.Errorf(err.Error())
		}
	})
	client.Join(channel)
	err := client.Connect()
	if err != nil {
		panic(err)
	}
}

func CrawlFromChannels(mariaDB *db.MariaDB, bigQueryDB *db.BigQuery) {
	ch := make(chan string)
	go overWatchStreamerList(mariaDB, ch)
	for {
		var channel = <-ch
		go crawlFromChannel(channel, mariaDB, bigQueryDB)
	}
}
