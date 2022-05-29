package routers

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"tchatong.info/controllers"
)

func SetStreamerRouter(router *gin.RouterGroup, db *sql.DB) {
	router.GET("", func(c *gin.Context) { controllers.GetAllStreamer(c, db) })
	router.GET("/:streamerId", func(c *gin.Context) { controllers.GetOneStreamer(c, db) })
}
