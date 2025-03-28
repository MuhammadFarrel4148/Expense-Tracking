package models

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
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
