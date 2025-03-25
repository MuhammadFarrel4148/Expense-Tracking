package handler

import (
	"gin/models"
	"gin/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ExpenseInput struct {
	Deskripsi	string		`json:"deskripsi"`	
	Nominal		float64		`json:"nominal" binding:"required"`
	Date		string		`json:"date" binding:"required"`
}

func CreateExpense(c *gin.Context) {
	var inputExpense ExpenseInput

	if err := c.ShouldBindBodyWithJSON(&inputExpense); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	expense := models.Goexpense {
		Id: utils.CreateId(),
		Deskripsi: inputExpense.Deskripsi,
		Nominal: inputExpense.Nominal,
		Date: inputExpense.Date,
		CreatedAt: time.Now().Format("2006-01-02 15:04:05"),
		UpdatedAt: time.Now().Format("2006-01-02 15:04:05"),
	}

	models.DB.Create(&expense)
	c.JSON(http.StatusOK, gin.H{
		"expense": expense,
	})
	return
}

func GetExpense(c *gin.Context) {
	var result []models.Goexpense

	models.DB.Find(&result)
	c.JSON(http.StatusOK, gin.H {
		"result": result,
	})
}
