package models

type ChatfirePerHour struct {
	Hour  int `json:"hour" bigquery:"hour"`
	Count int `json:"count" bigquery:"count"`
}

type ChatFirePerStreamer struct {
	StreamerLogin string `json:"streamerLogin" bigquery:"StreamerLogin"`
	ChatLogCount  int    `json:"chatLogCount" bigquery:"ChatLogCount"`
}
