package main

import (
	"github.com/gin-gonic/gin"
	"gin/models"
)

func main() {
	r := gin.Default()
	models.DatabaseConnect()

	r.Run(":3000")
}
