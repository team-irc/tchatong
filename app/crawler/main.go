package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"os"
	"tchatong.info/crawler"
)

func getDbInfo() (string, string, string) {
	dbUserName := os.Getenv("DB_USER")
	dbPassWord := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	if dbUserName == "" || dbPassWord == "" || dbName == "" {
		panic("Can't find db info")
	}
	return dbUserName, dbPassWord, dbName
}

func connectDB() *sql.DB {
	dbUserName, dbPassWord, dbName := getDbInfo()
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/%s", dbUserName, dbPassWord, dbName))
	if err != nil {
		panic(err)
	}
	return db
}

func main() {
	db := connectDB()
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			panic(err)
		}
	}(db)
	crawler.CrawlFromChannels(db)
}
