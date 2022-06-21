package models

type ChatFire struct {
	Id         int    `json:"id"`
	StreamerId string `json:"streamerId"`
	Date       string `json:"date"`
	Count      int    `json:"count"`
	Viewers    int    `json:"viewers"`
}

type ChatFireResponse struct {
	Time    string `json:"time"`
	Count   int    `json:"count"`
	Viewers int    `json:"viewers"`
}
