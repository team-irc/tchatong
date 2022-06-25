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
	redisDB := db.RedisDB{}.New()
	bigQueryDB := db.BigQuery{}.New()
	gin.SetMode(gin.DebugMode)
	router = gin.Default()
	routers.SetStreamerRouter(router.Group("/streamer"), mariaDB)
	routers.SetStatisticsRouter(router.Group("/statistics"), mariaDB, redisDB, bigQueryDB)
	routers.SetChatFireRouter(router.Group("/chat-fire"), mariaDB, redisDB)
	routers.SetTopWordRouter(router.Group("/top-word"), mariaDB)
	routers.SetVideoRouter(router.Group("/video"))
	go daemons.UpdateStreamerTable(mariaDB, redisDB)
	go daemons.UpdateLegendTable(mariaDB)
	go daemons.CrawlFromChannels(mariaDB, bigQueryDB)
}

func main() {
	err := http.ListenAndServe(":3000", router)
	if err != nil {
		println(err)
	}
}
