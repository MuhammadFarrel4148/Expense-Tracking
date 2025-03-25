package main

import (
	"gin/models"
	"gin/routing"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	models.DatabaseConnect()

	routing.SetupRouting(r)
	r.Run(":3000")
}
