package routers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/controllers"
	"tchatong.info/db"
)

func SetChatFireRouter(router *gin.RouterGroup, mariaDB *db.MariaDB) {
	router.GET("/:streamerId", func(c *gin.Context) { controllers.GetCurrentChatFire(c, mariaDB) })
	router.GET("/:streamerId/:interval", func(c *gin.Context) { controllers.GetChatFireByInterval(c, mariaDB) })
	router.GET("/day-top/:streamerId", func(c *gin.Context) { controllers.GetDayTopChatFire(c, mariaDB) })
	router.GET("/entire-top/:streamerId", func(c *gin.Context) { controllers.GetEntireTopChatFire(c, mariaDB) })
}
