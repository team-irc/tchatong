package daemons

import (
	"database/sql"
	"github.com/gempir/go-twitch-irc/v3"
	"log"
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
func overWatchStreamerList(db *sql.DB, ch chan string) {
	var streamerList []string
	for {
		res, err := db.Query("SELECT streamer_login FROM streamer")
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
func crawlFromChannel(channel string, db *sql.DB) {
	client := twitch.NewAnonymousClient()
	client.OnPrivateMessage(func(message twitch.PrivateMessage) {
		conn, err := db.Query("INSERT INTO chatlog VALUES (?, ?, ?)", message.RoomID, time.Now().UTC(), message.Message)
		defer func(conn *sql.Rows) {
			err := conn.Close()
			if err != nil {
				log.Fatal(err)
			}
		}(conn)
		if err != nil {
			log.Fatal(err)
		}
	})
	client.Join(channel)
	err := client.Connect()
	if err != nil {
		panic(err)
	}
}

func CrawlFromChannels(db *sql.DB) {
	ch := make(chan string)
	go overWatchStreamerList(db, ch)
	for {
		var channel = <-ch
		go crawlFromChannel(channel, db)
	}
}
