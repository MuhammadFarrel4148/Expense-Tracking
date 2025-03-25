package models

type Goexpense struct {
	Id        	string     		`gorm:"primaryKey" json:"id"`
	Deskripsi 	string			`gorm:"enum('eat', 'shopping', 'needs');default:'eat'" json:"deskripsi"`
	Nominal   	float64     	`gorm:"not null" json:"nominal"`
	Date      	string 			`gorm:"not null" json:"date"`
	CreatedAt 	string			`gorm:"autoCreateTime" json:"createdAt",string`
	UpdatedAt 	string	 		`gorm:"autoUpdateTime" json:"updatedAt",string`
}