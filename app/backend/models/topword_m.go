package models

type TopWord struct {
	Id         int    `json:"id"`
	StreamerId string `json:"streamerId"`
	Date       string `json:"date"`
	Top1       string `json:"top1"`
	Top2       string `json:"top2"`
	Top3       string `json:"top3"`
	Top4       string `json:"top4"`
	Top5       string `json:"top5"`
	Top6       string `json:"top6"`
	Top7       string `json:"top7"`
	Top8       string `json:"top8"`
	Top9       string `json:"top9"`
	Top10      string `json:"top10"`
}
