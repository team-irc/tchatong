package models

type TopWord struct {
	Id         int    `json:"id"`
	StreamerId string `json:"streamerId"`
	Date       string `json:"date"`
	Top1       string `json:"top1"`
	Top1Count  int    `json:"top1Count"`
	Top2       string `json:"top2"`
	Top2Count  int    `json:"top2Count"`
	Top3       string `json:"top3"`
	Top3Count  int    `json:"top3Count"`
	Top4       string `json:"top4"`
	Top4Count  int    `json:"top4Count"`
	Top5       string `json:"top5"`
	Top5Count  int    `json:"top5Count"`
	Top6       string `json:"top6"`
	Top6Count  int    `json:"top6Count"`
	Top7       string `json:"top7"`
	Top7Count  int    `json:"top7Count"`
	Top8       string `json:"top8"`
	Top8Count  int    `json:"top8Count"`
	Top9       string `json:"top9"`
	Top9Count  int    `json:"top9Count"`
	Top10      string `json:"top10"`
	Top10Count int    `json:"top10Count"`
}
