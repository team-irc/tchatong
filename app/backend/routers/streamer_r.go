package routers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/controllers"
	"tchatong.info/db"
)

func SetStreamerRouter(router *gin.RouterGroup, mariaDB *db.MariaDB) {
	router.GET("", func(c *gin.Context) { controllers.GetAllStreamer(c, mariaDB) })
	router.GET("/:streamerId", func(c *gin.Context) { controllers.GetOneStreamer(c, mariaDB) })
}
