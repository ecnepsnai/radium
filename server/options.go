package server

import (
	"encoding/json"
	"os"
	"path"
	"sync"
)

// E6Options describes options for the Radium server
type E6Options struct {
	ExampleString string
	ExampleBool   bool
}

// Options the global options
var Options *E6Options
var optionsLock = sync.Mutex{}

// LoadOptions load E6 options
func LoadOptions() {
	defaults := E6Options{
		ExampleString: "Default",
		ExampleBool:   true,
	}

	if !FileExists(path.Join(Directories.Data, "radium.conf")) {
		Options = &defaults
		if err := Options.Save(); err != nil {
			log.Fatal("Error setting default options: %s", err.Error())
		}
	} else {
		f, err := os.OpenFile(path.Join(Directories.Data, "radium.conf"), os.O_RDONLY, os.ModePerm)
		if err != nil {
			log.Fatal("Error opening config file: %s", err.Error())
		}
		defer f.Close()
		options := defaults
		if err := json.NewDecoder(f).Decode(&options); err != nil {
			log.Fatal("Error decoding options: %s", err.Error())
		}
		Options = &options
	}
}

// Save save the options to disk
func (o *E6Options) Save() error {
	optionsLock.Lock()
	defer optionsLock.Unlock()

	f, err := os.OpenFile(path.Join(Directories.Data, "radium.conf"), os.O_RDWR|os.O_CREATE, os.ModePerm)
	if err != nil {
		log.Error("Error opening config file: %s", err.Error())
		return err
	}
	defer f.Close()
	if err := json.NewEncoder(f).Encode(o); err != nil {
		log.Error("Error encoding options: %s", err.Error())
		return err
	}

	Options = o

	return nil
}
