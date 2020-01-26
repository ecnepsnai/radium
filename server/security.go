package server

import (
	gonanoid "github.com/matoous/go-nanoid"
	uuid "github.com/satori/go.uuid"
)

// NewID generate a new ID
func NewID() string {
	id, err := gonanoid.Generate("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890", 11)
	if err != nil {
		panic(err)
	}
	return id
}

// NewUUID generate a new UUID
func NewUUID() string {
	return uuid.NewV4().String()
}
