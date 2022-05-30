package routers

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"tchatong.info/controllers"
)

func SetChatFireRouter(router *gin.RouterGroup, db *sql.DB) {
	router.GET("/:streamerId", func(c *gin.Context) { controllers.GetCurrentChatFire(c, db) })
	router.GET("/:streamerId/:interval", func(c *gin.Context) { controllers.GetAllChatFire(c, db) })
}
