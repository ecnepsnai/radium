package server

import (
	"crypto/sha256"
	"fmt"
	"io"
	"os"

	"github.com/ecnepsnai/security"
	nanoid "github.com/matoous/go-nanoid"
)

func newID() string {
	id, err := nanoid.Generate("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890._-", 12)
	if err != nil {
		panic(err)
	}
	return id
}

func newPlainID() string {
	id, err := nanoid.Generate("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890", 12)
	if err != nil {
		panic(err)
	}
	return id
}

func generateSessionSecret() string {
	return security.RandomString(8)
}

func getHostname() string {
	h, err := os.Hostname()
	if err != nil {
		panic(err)
	}
	return h
}

func stringSliceContains(n string, h []string) bool {
	for _, s := range h {
		if s == n {
			return true
		}
	}
	return false
}

func hashFile(filePath string) (string, error) {
	h := sha256.New()

	f, err := os.OpenFile(filePath, os.O_RDONLY, os.ModePerm)
	if err != nil {
		return "", err
	}
	defer f.Close()

	if _, err := io.Copy(h, f); err != nil {
		return "", err
	}

	return fmt.Sprintf("%x", h.Sum(nil)), nil
}
