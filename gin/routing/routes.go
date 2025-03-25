package routing

import (
	"gin/handler"

	"github.com/gin-gonic/gin"
)

func SetupRouting(router *gin.Engine) {
	api := router.Group("")
	{
		api.POST("/expense", handler.CreateExpense)
		api.GET("/expense", handler.GetExpense)
	}
}
