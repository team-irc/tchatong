package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"net/http"
	"tchatong.info/daemons"
	"tchatong.info/routers"
)

var router *gin.Engine

func init() {
	router = gin.Default()
	streamerRouter := router.Group("/streamer")
	routers.SetStreamerRouter(streamerRouter)
	go daemons.OverWatchStreamerTable()
}

func main() {
	err := http.ListenAndServe(":3000", router)
	if err != nil {
		println(err)
	}
}
