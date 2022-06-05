package controllers

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"tchatong.info/services"
)

func GetTopWord(c *gin.Context, db *sql.DB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetTopWord(streamerId, db))
}
