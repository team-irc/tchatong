package services

import (
	"fmt"
	"google.golang.org/api/iterator"
	"os"
	"tchatong.info/db"
	"tchatong.info/models"
)

func GetChatfirePerHour(bigQueryDB *db.BigQuery) []models.ChatfirePerHour {
	var ret = make([]models.ChatfirePerHour, 0)
	datasetID := os.Getenv("GOOGLE_DATASET_ID")
	tableID := os.Getenv("GOOGLE_TABLE_ID")
	iter, err := bigQueryDB.Query(fmt.Sprintf(`
		SELECT
		  EXTRACT(HOUR FROM DATETIME(date, "Asia/Seoul")) as hour,
		  COUNT(*) AS count
		FROM
		  %s.%s
		GROUP BY
		  hour
		ORDER BY
		  hour
	`, datasetID, tableID))
	if err != nil {
		_ = fmt.Errorf(err.Error())
	}
	for {
		var row models.ChatfirePerHour
		err := iter.Next(&row)
		if err == iterator.Done {
			break
		}
		if err != nil {
			_ = fmt.Errorf("error iterating through results: %v", err)
		}
		ret = append(ret, row)
	}
	return ret
}

func GetChatfirePerStreamer(bigQueryDB *db.BigQuery) []models.ChatFirePerStreamer {
	var ret = make([]models.ChatFirePerStreamer, 0)
	datasetID := os.Getenv("GOOGLE_DATASET_ID")
	tableID := os.Getenv("GOOGLE_TABLE_ID")
	iter, err := bigQueryDB.Query(fmt.Sprintf(`
		SELECT
		  	StreamerLogin, COUNT(*) AS ChatLogCount
		FROM
		  	%s.%s
		WHERE
		 	date BETWEEN TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL -30 DAY) AND TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL -1 DAY)
		GROUP BY
		  	StreamerLogin
		ORDER BY
			ChatLogCount DESC;
	`, datasetID, tableID))
	if err != nil {
		_ = fmt.Errorf(err.Error())
	}
	for {
		var row models.ChatFirePerStreamer
		err := iter.Next(&row)
		if err == iterator.Done {
			break
		}
		if err != nil {
			_ = fmt.Errorf("error iterating through results: %v", err)
		}
		ret = append(ret, row)
	}
	return ret
}
