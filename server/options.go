package server

import (
	"encoding/json"
	"fmt"
	"os"
	"path"
	"sync"
)

const configFileName = "radium.conf"

type radiumOptions struct {
	General optionsGeneral
}

type optionsGeneral struct {
	ServerURL string
}

// Options the global options
var Options *radiumOptions
var optionsLock = sync.Mutex{}

// LoadOptions load Otto Server options
func LoadOptions() {
	defaults := radiumOptions{
		General: optionsGeneral{
			ServerURL: "http://" + bindAddress + "/",
		},
	}

	if !FileExists(path.Join(Directories.Data, configFileName)) {
		Options = &defaults
		Options.Save()
	} else {
		f, err := os.OpenFile(path.Join(Directories.Data, configFileName), os.O_RDONLY, os.ModePerm)
		if err != nil {
			log.Fatal("Error opening config file: %s", err.Error())
		}
		defer f.Close()
		options := defaults
		if err := json.NewDecoder(f).Decode(&options); err != nil {
			log.Fatal("Error decoding options: %s", err.Error())
		}
		if err := options.Validate(); err != nil {
			log.Fatal("Invalid Otto Server Options: %s", err.Error())
		}
		Options = &options
	}
}

// Save save the options to disk. Will panic on any error. Returns true if the options did change
func (o *radiumOptions) Save() (string, bool) {
	optionsLock.Lock()
	defer optionsLock.Unlock()

	beforeHash := optionsFileHash()

	atomicPath := path.Join(Directories.Data, fmt.Sprintf(".%s_%s", configFileName, newPlainID()))
	realPath := path.Join(Directories.Data, configFileName)

	f, err := os.OpenFile(atomicPath, os.O_WRONLY|os.O_CREATE, os.ModePerm)
	if err != nil {
		log.Panic("Error opening config file: %s", err.Error())
	}
	if err := json.NewEncoder(f).Encode(o); err != nil {
		f.Close()
		log.Panic("Error encoding options: %s", err.Error())
	}
	f.Close()

	if err := os.Rename(atomicPath, realPath); err != nil {
		log.Panic("Error updating config file: %s", err.Error())
	}

	Options = o

	afterHash := optionsFileHash()
	return afterHash, beforeHash != afterHash
}

func optionsFileHash() string {
	configPath := path.Join(Directories.Data, configFileName)
	if !FileExists(configPath) {
		return ""
	}

	h, err := hashFile(configPath)
	if err != nil {
		log.Panic("Error hasing config file: %s", err.Error())
	}

	return h
}

// Validate returns an error if the options is not valid
func (o *radiumOptions) Validate() error {
	if o.General.ServerURL == "" {
		return fmt.Errorf("A server URL is required")
	}
	return nil
}
