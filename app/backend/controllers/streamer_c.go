package controllers

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"tchatong.info/services"
)

func GetAllStreamer(c *gin.Context, db *sql.DB) {
	c.JSON(200, gin.H{
		"streamerList": services.GetAllStreamer(db),
	})
}

func GetOneStreamer(c *gin.Context, db *sql.DB) {
	streamerId := c.Param("streamerId")
	c.JSON(200, services.GetOneStreamer(streamerId, db))
}
