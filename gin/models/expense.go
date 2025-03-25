package models

import "time"

type Goexpense struct {
	Id        	string     		`gorm:"primaryKey" json:"id"`
	Deskripsi 	string			`gorm:"enum('eat', 'shopping', 'needs');default:'use'" json:"deskripsi"`
	Nominal   	float64     	`gorm:"not null" json:"nominal"`
	Date      	time.Time 		`gorm:"not null" json:"date"`
	CreatedAt 	time.Time 		`gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt 	time.Time 		`gorm:"autoUpdateTime" json:"updatedAt"`
}
