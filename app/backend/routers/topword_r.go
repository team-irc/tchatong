package routers

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"tchatong.info/controllers"
)

func SetTopWordRouter(router *gin.RouterGroup, db *sql.DB) {
	router.GET("/:streamerId", func(c *gin.Context) { controllers.GetTopWord(c, db) })
}
