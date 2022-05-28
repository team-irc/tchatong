package controllers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/services"
)

func GetAllStreamer(c *gin.Context) {
	c.JSON(200, gin.H{
		"streamerList": services.GetAllStreamer(),
	})
}

func GetOneStreamer(c *gin.Context) {
	streamerId := c.Param("streamerId")
	c.JSON(200, services.GetOneStreamer(streamerId))
}
