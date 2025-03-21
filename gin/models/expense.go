package models

import "time"

type Goexpense struct {
	Id        	int64  		`gorm:"primaryKey" json:"id"`
	Deskripsi 	string 		`gorm:"varchar(255);not null" json:"deskripsi"`
	Nominal   	int64  		`gorm:"not null" json:"nominal"`
	Date      	time.Time 	`gorm:"not null" json:"date"`
	createdAt	time.Time	`gorm:"autoCreateTime" json:"createdAt"`
	updatedAt	time.Time	`gorm:"autoUpdateTime" json:"updatedAt"`
}
