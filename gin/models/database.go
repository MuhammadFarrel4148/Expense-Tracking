package models

import (
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

var DB *gorm.DB

func DatabaseConnect() {
	database, err := gorm.Open(mysql.Open("root:@tcp(localhost:3306)/expense-tracking"))

	if err != nil {
		panic(err)
	}

	database.AutoMigrate(&Goexpense{})

	DB = database
}
