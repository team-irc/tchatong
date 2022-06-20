package models

import "time"

type ChatLog struct {
	StreamerId    string
	StreamerLogin string
	Date          time.Time
	Content       string
}
