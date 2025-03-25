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

	parsedData, err := time.Parse("2006-01-02", inputExpense.Date)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H {
			"message": "Format tanggal salah, gunakna YYYY-DD-MM",
		})
		return
	}

	expense := models.Goexpense {
		Id: utils.CreateId(),
		Deskripsi: inputExpense.Deskripsi,
		Nominal: inputExpense.Nominal,
		Date: parsedData,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	models.DB.Create(&expense)
	c.JSON(http.StatusOK, gin.H{
		"expense": expense,
	})
	return
}
