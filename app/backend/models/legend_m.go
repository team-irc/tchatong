package models

type Legend struct {
	Id         int    `json:"id"`
	StreamerId string `json:"streamerId"`
	ChatFireId int    `json:"chatFireId"`
	LastUpdate string `json:"lastUpdate"`
}
