package controllers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/services"
)

func GoToVideo(c *gin.Context) {
	var streamerId string
	var targetTime string

	streamerId = c.Param("streamerId")
	targetTime = c.Param("time")
	c.String(200, services.GoToVideo(streamerId, targetTime))
}
