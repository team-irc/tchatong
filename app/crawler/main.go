package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"os"
	"tchatong.info/crawler"
)

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

func connectDB() *sql.DB {
	dbHost, dbUserName, dbPassWord, dbName := getDbInfo()
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUserName, dbPassWord, dbHost, dbName))
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
