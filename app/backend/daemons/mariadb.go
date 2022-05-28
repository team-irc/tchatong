package daemons

import (
	"database/sql"
	"fmt"
	"os"
)

var db *sql.DB

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

func init() {
	dbHost, dbUserName, dbPassWord, dbName := getDbInfo()
	var err error
	db, err = sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUserName, dbPassWord, dbHost, dbName))
	if err != nil {
		panic(err)
	}
}
