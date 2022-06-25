package db

import (
	"cloud.google.com/go/bigquery"
	"context"
	"fmt"
	"os"
	"tchatong.info/models"
)

type BigQuery struct {
	client    *bigquery.Client
	inserter  *bigquery.Inserter
	projectID string
	datasetID string
	tableID   string
}

func (bigQuery BigQuery) New() *BigQuery {
	projectID := os.Getenv("GOOGLE_PROJECT_ID")
	datasetID := os.Getenv("GOOGLE_DATASET_ID")
	tableID := os.Getenv("GOOGLE_TABLE_ID")
	if projectID == "" || datasetID == "" || tableID == "" {
		panic("Can't find BigQuery db info")
	}
	client, err := bigquery.NewClient(context.Background(), projectID)
	if err != nil {
		panic(err)
	}
	inserter := client.Dataset(datasetID).Table(tableID).Inserter()
	return &BigQuery{client: client, inserter: inserter, projectID: projectID, datasetID: datasetID, tableID: tableID}
}

func (bigQuery BigQuery) InsertRow(item models.ChatLog) {
	err := bigQuery.inserter.Put(context.Background(), item)
	if err != nil {
		_ = fmt.Errorf(err.Error())
	}
}

func (bigQuery BigQuery) Query(query string) (*bigquery.RowIterator, error) {
	q := bigQuery.client.Query(query)
	return q.Read(context.Background())
}
