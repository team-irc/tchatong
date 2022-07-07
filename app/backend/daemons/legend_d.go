package daemons

import (
	"database/sql"
	"fmt"
	"tchatong.info/db"
	"tchatong.info/models"
	"time"
)

func updateRow(streamerId string, mariaDB *db.MariaDB) {
	var chatFireId string
	var currentLegend int
	var newLegend int

	_ = mariaDB.QueryRow("SELECT id FROM chatfire WHERE streamer_id=? ORDER BY count DESC", streamerId).Scan(&chatFireId)
	_ = mariaDB.QueryRow("SELECT count FROM chatfire WHERE id=(SELECT chatfire_id FROM legend WHERE streamer_id=?)", streamerId).Scan(&currentLegend)
	_ = mariaDB.QueryRow("SELECT count FROM chatfire WHERE id=?", chatFireId).Scan(&newLegend)
	if newLegend >= currentLegend {
		res, err := mariaDB.Query("UPDATE legend SET chatfire_id=?, last_update_date=? WHERE streamer_id=?", chatFireId, time.Now(), streamerId)
		if err != nil {
			_ = fmt.Errorf(err.Error())
		} else {
			defer func(res *sql.Rows) {
				_ = res.Close()
			}(res)
		}
	}
}

func insertRow(streamerId string, mariaDB *db.MariaDB) {
	var chatFireId string

	_ = mariaDB.QueryRow("SELECT id FROM chatfire WHERE streamer_id=? ORDER BY count DESC", streamerId).Scan(&chatFireId)
	if chatFireId == "" {
		return
	}
	res, _ := mariaDB.Query("INSERT INTO legend VALUES (default, ?, ?, ?)", streamerId, chatFireId, time.Now())
	defer func(res *sql.Rows) {
		_ = res.Close()
	}(res)
}

func UpdateLegendTable(mariaDB *db.MariaDB) {
	for {
		start := time.Now()
		(func() {
			rows, err := mariaDB.Query("SELECT streamer_id FROM streamer")
			defer func(rows *sql.Rows) {
				_ = rows.Close()
			}(rows)
			if err != nil {
				_ = fmt.Errorf(err.Error())
			}
			for rows.Next() {
				var streamerId string
				var legend models.Legend
				err := rows.Scan(&streamerId)
				if err != nil {
					_ = fmt.Errorf(err.Error())
				}
				_ = mariaDB.QueryRow("SELECT * FROM legend WHERE streamer_id=?", streamerId).Scan(&legend.Id, &legend.StreamerId, &legend.ChatFireId, &legend.LastUpdate)
				if (legend == models.Legend{}) {
					insertRow(streamerId, mariaDB)
				} else {
					updateRow(streamerId, mariaDB)
				}
			}
		})()
		end := time.Since(start)
		println(fmt.Sprintf("[%s]: legend table update (wasted time: %s)", time.Now().Truncate(time.Second).Local(), end))
		time.Sleep(time.Minute)
	}
}
