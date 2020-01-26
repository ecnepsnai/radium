package server

import (
	"fmt"
	"os"
	"path"
	"strings"
	"time"

	"github.com/ecnepsnai/security"
)

// FormatByte format the given byte number to a string
func FormatByte(b uint64) string {
	const unit = 1024
	if b < unit {
		return fmt.Sprintf("%d B", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %ciB", float64(b)/float64(div), "KMGTPE"[exp])
}

// SanitizePath sanitize the path component
func SanitizePath(part string) string {
	p := part

	// Need to remove all NTFS characters,
	// as well as a couple more annoynances
	naughty := map[string]string{
		"<":    "",
		">":    "",
		":":    "",
		"\"":   "",
		"/":    "",
		"\\":   "",
		"|":    "",
		"?":    "",
		"*":    "",
		" ":    "_",
		",":    "",
		"#":    "",
		"\000": "",
	}

	for bad, good := range naughty {
		p = strings.Replace(p, bad, good, -1)
	}

	// Don't allow UNIX "hidden" files
	if p[0] == '.' {
		p = "_" + p
	}

	return p
}

// CurrentYear return the current year as a string
func CurrentYear() string {
	return fmt.Sprintf("%d", CurrentTime().Year())
}

// TouchDirectory update the Ctime of a directory
func TouchDirectory(directory string) {
	name := path.Join(directory, "."+security.RandomString(12))

	file, err := os.OpenFile(name, os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Error("Error touching directory '%s': %s", directory, err.Error())
		return
	}
	file.Close()
	if err := os.Remove(name); err != nil {
		log.Error("Error touching directory '%s': %s", directory, err.Error())
	}
}

// TimeEquals do the given times match
func TimeEquals(a time.Time, b time.Time) bool {
	return a.UnixNano() == b.UnixNano()
}

// Hostname get the system hostname
func Hostname() string {
	h, err := os.Hostname()
	if err != nil {
		panic(err)
	}
	return h
}

// RemoveIfExists remove a file only if it exists
func RemoveIfExists(file string) error {
	if !FileExists(file) {
		return nil
	}
	return os.Remove(file)
}

// CurrentTime return the current time. This is made into a function so it can be mocked
func CurrentTime() time.Time {
	return time.Now()
}
