package server

import (
	nanoid "github.com/matoous/go-nanoid"
)

// NewID generate a new
func NewID() string {
	id, err := nanoid.Generate("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890._-", 12)
	if err != nil {
		panic(err)
	}
	return id
}
