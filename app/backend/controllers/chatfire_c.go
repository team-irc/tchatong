package controllers

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"strconv"
	"tchatong.info/services"
)

func GetChatFireByInterval(c *gin.Context, db *sql.DB) {
	var streamerId string
	var interval int

	streamerId = c.Param("streamerId")
	interval, err := strconv.Atoi(c.Param("interval"))
	if interval < 1 || interval > 60 {
		c.String(400, "interval scope is 1 <= interval <= 60")
	} else if err != nil {
		c.String(400, "interval should be number")
	} else {
		c.JSON(200, services.GetChatFireByInterval(streamerId, interval, db))
	}
}

func GetDayTopChatFire(c *gin.Context, db *sql.DB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetDayTopChatFire(streamerId, db))
}

func GetCurrentChatFire(c *gin.Context, db *sql.DB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetCurrentChatFire(streamerId, db))
}
