package models

import (
	"cloud.google.com/go/bigquery"
	"time"
)

type ChatLog struct {
	StreamerId    string
	StreamerLogin string
	Date          time.Time
	Content       string
}

// Save implements the ValueSaver interface.
// This example disables best-effort de-duplication, which allows for higher throughput.
func (i *ChatLog) Save() (map[string]bigquery.Value, string, error) {
	return map[string]bigquery.Value{
		"StreamerId":    i.StreamerId,
		"StreamerLogin": i.StreamerLogin,
		"Date":          i.Date,
		"Content":       i.Content,
	}, bigquery.NoDedupeID, nil
}
