package server

import (
	"os"

	"github.com/ecnepsnai/security"
)

// GenerateSessionSecret generate a sutable secret for a user session
func GenerateSessionSecret() string {
	return security.RandomString(8)
}

// Hostname get the system hostname
func Hostname() string {
	h, err := os.Hostname()
	if err != nil {
		panic(err)
	}
	return h
}

// StringSliceContains does this slice of strings contain n?
func StringSliceContains(n string, h []string) bool {
	for _, s := range h {
		if s == n {
			return true
		}
	}
	return false
}
