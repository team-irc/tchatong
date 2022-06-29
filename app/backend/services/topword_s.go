package services

import (
	"fmt"
	"tchatong.info/db"
	"tchatong.info/models"
)

func GetTopWord(streamerId string, mariaDB *db.MariaDB) models.TopWord {
	var topWord models.TopWord

	err := mariaDB.QueryRow(
		`SELECT id,
					streamer_id,
					date,
					top1,
					COALESCE(top1_count, 0),
					top2,
					COALESCE(top2_count, 0),
					top3,
					COALESCE(top3_count, 0),
					top4,
					COALESCE(top4_count, 0),
					top5,
					COALESCE(top5_count, 0),
					top6,
					COALESCE(top6_count, 0),
					top7,
					COALESCE(top7_count, 0),
					top8,
					COALESCE(top8_count, 0),
					top9,
					COALESCE(top9_count, 0),
					top10,
					COALESCE(top10_count, 0)
				FROM
					topword
				WHERE
					streamer_id=?
				ORDER BY
					date DESC`, streamerId).Scan(
		&topWord.Id,
		&topWord.StreamerId,
		&topWord.Date,
		&topWord.Top1,
		&topWord.Top1Count,
		&topWord.Top2,
		&topWord.Top2Count,
		&topWord.Top3,
		&topWord.Top3Count,
		&topWord.Top4,
		&topWord.Top4Count,
		&topWord.Top5,
		&topWord.Top5Count,
		&topWord.Top6,
		&topWord.Top6Count,
		&topWord.Top7,
		&topWord.Top7Count,
		&topWord.Top8,
		&topWord.Top8Count,
		&topWord.Top9,
		&topWord.Top9Count,
		&topWord.Top10,
		&topWord.Top10Count)
	if err != nil {
		_ = fmt.Errorf(err.Error())
	}
	fmt.Println(topWord.StreamerId)
	fmt.Println(topWord.Top1)
	fmt.Println(topWord.Top1Count)
	return topWord
}
