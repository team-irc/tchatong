package models

type Streamer struct {
	Id            int    `json:"id"`
	StreamerId    string `json:"streamerId"`
	StreamerLogin string `json:"streamerLogin"`
	Nick          string `json:"nick"`
	ImageUrl      string `json:"imageUrl"`
	OnAir         *bool  `json:"onAir"`
	Viewers       *int   `json:"viewers"`
	Followers     *int   `json:"followers"`
}
