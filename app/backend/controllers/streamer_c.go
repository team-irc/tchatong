package controllers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/db"
	"tchatong.info/services"
)

func GetAllStreamer(c *gin.Context, mariaDB *db.MariaDB) {
	c.JSON(200, gin.H{
		"streamerList": services.GetAllStreamer(mariaDB),
	})
}

func GetOneStreamer(c *gin.Context, mariaDB *db.MariaDB) {
	streamerId := c.Param("streamerId")
	c.JSON(200, services.GetOneStreamer(streamerId, mariaDB))
}
