package db

import (
	"database/sql"
	"fmt"
	"os"
)

type MariaDB struct {
	db *sql.DB
}

func (mariaDB MariaDB) New() *MariaDB {
	dbHost := os.Getenv("DB_HOST")
	dbUserName := os.Getenv("DB_USER")
	dbPassWord := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	if dbHost == "" || dbUserName == "" || dbPassWord == "" || dbName == "" {
		panic("Can't find db info")
	}
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUserName, dbPassWord, dbHost, dbName))
	if err != nil {
		panic(err)
	}
	return &MariaDB{db}
}

func (mariaDB MariaDB) QueryRow(query string, queryArgs ...any) *sql.Row {
	return mariaDB.db.QueryRow(query, queryArgs...)
}

func (mariaDB MariaDB) Query(query string, queryArgs ...any) (*sql.Rows, error) {
	return mariaDB.db.Query(query, queryArgs...)
}
