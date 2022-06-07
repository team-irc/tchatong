package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"net/http"
	"os"
	"tchatong.info/daemons"
	"tchatong.info/routers"
)

var router *gin.Engine

func getDbInfo() (string, string, string, string) {
	dbHost := os.Getenv("DB_HOST")
	dbUserName := os.Getenv("DB_USER")
	dbPassWord := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	if dbHost == "" || dbUserName == "" || dbPassWord == "" || dbName == "" {
		panic("Can't find db info")
	}
	return dbHost, dbUserName, dbPassWord, dbName
}

func getDB() *sql.DB {
	dbHost, dbUserName, dbPassWord, dbName := getDbInfo()
	var err error
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUserName, dbPassWord, dbHost, dbName))
	if err != nil {
		panic(err)
	}
	return db
}

func init() {
	db := getDB()
	router = gin.Default()
	streamerRouter := router.Group("/streamer")
	chatFireRouter := router.Group("/chat-fire")
	topWordRouter := router.Group("/top-word")
	videoRouter := router.Group("/video")
	routers.SetStreamerRouter(streamerRouter, db)
	routers.SetChatFireRouter(chatFireRouter, db)
	routers.SetTopWordRouter(topWordRouter, db)
	routers.SetVideoRouter(videoRouter)
	go daemons.UpdateStreamerTable(db)
	go daemons.UpdateLegendTable(db)
	go daemons.CrawlFromChannels(db)
}

func main() {
	err := http.ListenAndServe(":3000", router)
	if err != nil {
		println(err)
	}
}
