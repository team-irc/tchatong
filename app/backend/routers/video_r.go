package routers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/controllers"
)

func SetVideoRouter(router *gin.RouterGroup) {
	router.GET("/:streamerId/:time", func(c *gin.Context) { controllers.GoToVideo(c) })
}
