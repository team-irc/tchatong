package controllers

import (
	"github.com/gin-gonic/gin"
	"strconv"
	"tchatong.info/db"
	"tchatong.info/services"
)

func GetEntireTopChatFire(c *gin.Context, mariaDB *db.MariaDB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetEntireTopChatFire(streamerId, mariaDB))
}

func GetChatFireByInterval(c *gin.Context, mariaDB *db.MariaDB) {
	var streamerId string
	var interval int

	streamerId = c.Param("streamerId")
	interval, err := strconv.Atoi(c.Param("interval"))
	if interval < 1 || interval > 60 {
		c.String(400, "interval scope is 1 <= interval <= 60")
	} else if err != nil {
		c.String(400, "interval should be number")
	} else {
		c.JSON(200, services.GetChatFireByInterval(streamerId, interval, mariaDB))
	}
}

func GetDayTopChatFire(c *gin.Context, mariaDB *db.MariaDB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetDayTopChatFire(streamerId, mariaDB))
}

func GetCurrentChatFire(c *gin.Context, mariaDB *db.MariaDB) {
	var streamerId string

	streamerId = c.Param("streamerId")
	c.JSON(200, services.GetCurrentChatFire(streamerId, mariaDB))
}
