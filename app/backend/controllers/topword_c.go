package controllers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/db"
	"tchatong.info/services"
)

func GetTopWord(c *gin.Context, mariaDB *db.MariaDB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetTopWord(streamerId, mariaDB))
}
