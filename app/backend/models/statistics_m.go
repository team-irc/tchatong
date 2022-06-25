package models

type ChatfirePerHour struct {
	Hour  int `json:"hour" bigquery:"hour"`
	Count int `json:"count" bigquery:"count"`
}

type ChatFirePerStreamer struct {
	StreamerId   string `bigquery:"StreamerId"`
	ChatLogCount int    `bigquery:"ChatLogCount"`
}

type ChatFirePerStreamerResponse struct {
	StreamerNick string `json:"streamerNick"`
	ChatLogCount int    `json:"chatLogCount"`
}
