package routers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/controllers"
	"tchatong.info/db"
)

func SetStatisticsRouter(router *gin.RouterGroup, redisDB *db.RedisDB, bigQueryDB *db.BigQuery) {
	router.GET("/chat-fire/hour", func(c *gin.Context) { controllers.GetChatfirePerHour(c, redisDB, bigQueryDB) })
	router.GET("/chat-fire/streamer", func(c *gin.Context) { controllers.GetChatfirePerStreamer(c, redisDB, bigQueryDB) })
}
