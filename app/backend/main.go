package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"net/http"
	"tchatong.info/daemons"
	"tchatong.info/db"
	"tchatong.info/routers"
)

var router *gin.Engine

func init() {
	mariaDB := db.MariaDB{}.New()
	router = gin.Default()
	streamerRouter := router.Group("/streamer")
	chatFireRouter := router.Group("/chat-fire")
	topWordRouter := router.Group("/top-word")
	videoRouter := router.Group("/video")
	routers.SetStreamerRouter(streamerRouter, mariaDB)
	routers.SetChatFireRouter(chatFireRouter, mariaDB)
	routers.SetTopWordRouter(topWordRouter, mariaDB)
	routers.SetVideoRouter(videoRouter)
	go daemons.UpdateStreamerTable(mariaDB)
	go daemons.UpdateLegendTable(mariaDB)
	go daemons.CrawlFromChannels(mariaDB)
}

func main() {
	err := http.ListenAndServe(":3000", router)
	if err != nil {
		println(err)
	}
}
