package utils 

import "github.com/jaevor/go-nanoid"

func CreateId() string {
	id, err := nanoid.Standard(16)

	if err != nil {
		panic(err)
	}

	return id()
}
