package routers

import (
	"github.com/gin-gonic/gin"
	"tchatong.info/controllers"
)

func SetStreamerRouter(router *gin.RouterGroup) {
	router.GET("", controllers.GetAllStreamer)
	router.GET("/:streamerId", controllers.GetOneStreamer)
}
