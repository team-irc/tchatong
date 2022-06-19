package routers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/controllers"
	"tchatong.info/db"
)

func SetTopWordRouter(router *gin.RouterGroup, mariaDB *db.MariaDB) {
	router.GET("/:streamerId", func(c *gin.Context) { controllers.GetTopWord(c, mariaDB) })
}
