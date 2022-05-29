package controllers

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"strconv"
	"tchatong.info/services"
)

func GetAllChatFire(c *gin.Context, db *sql.DB) {
	var streamerId string
	var interval int

	streamerId = c.Param("streamerId")
	interval, _ = strconv.Atoi(c.Param("interval"))
	if interval < 1 || interval > 60 {
		c.String(400, "interval scope is 1 <= interval <= 60")
	} else {
		c.JSON(200, services.GetChatFireByInterval(streamerId, interval, db))
	}
}
