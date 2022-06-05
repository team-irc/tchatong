package daemons

import (
	"database/sql"
	"fmt"
	"tchatong.info/models"
	"time"
)

func updateRow(streamerId string, db *sql.DB) {
	var chatFireId string
	var currentLegend int
	var newLegend int

	_ = db.QueryRow("SELECT id FROM chatfire WHERE streamer_id=? ORDER BY count DESC", streamerId).Scan(&chatFireId)
	_ = db.QueryRow("SELECT count FROM chatfire WHERE id=(SELECT chatfire_id FROM legend WHERE streamer_id=?)", streamerId).Scan(&currentLegend)
	_ = db.QueryRow("SELECT count FROM chatfire WHERE id=?", chatFireId).Scan(&newLegend)
	if newLegend >= currentLegend {
		res, _ := db.Query("UPDATE legend SET chatfire_id=?, last_update_date=? WHERE streamer_id=?", chatFireId, time.Now(), streamerId)
		defer res.Close()
	}
}

func insertRow(streamerId string, db *sql.DB) {
	var chatFireId string

	_ = db.QueryRow("SELECT id FROM chatfire WHERE streamer_id=? ORDER BY count DESC", streamerId).Scan(&chatFireId)
	if chatFireId == "" {
		return
	}
	res, _ := db.Query("INSERT INTO legend VALUES (default, ?, ?, ?)", streamerId, chatFireId, time.Now())
	defer res.Close()
}

func UpdateLegendTable(db *sql.DB) {
	for {
		start := time.Now()
		(func() {
			rows, err := db.Query("SELECT streamer_id FROM streamer")
			defer rows.Close()
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
				_ = db.QueryRow("SELECT * FROM legend WHERE streamer_id=?", streamerId).Scan(&legend.Id, &legend.StreamerId, &legend.ChatFireId, &legend.LastUpdate)
				if (legend == models.Legend{}) {
					insertRow(streamerId, db)
				} else {
					updateRow(streamerId, db)
				}
			}
		})()
		end := time.Since(start)
		println(fmt.Sprintf("[%s]: legend table update (wasted time: %s)", time.Now().Truncate(time.Second).Local(), end))
		time.Sleep(time.Minute)
	}
}
