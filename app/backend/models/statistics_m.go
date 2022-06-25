package models

type ChatfirePerHour struct {
	Hour  int `json:"hour" bigquery:"hour"`
	Count int `json:"count" bigquery:"count"`
}
