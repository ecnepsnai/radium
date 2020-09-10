package server

import (
	"path"

	"github.com/ecnepsnai/logtic"
)

// Start the app
func Start() {
	preBootstrapArgs()
	startup()
	postBootstrapArgs()
	RouterSetup()
}

// Stop stop the API service gracefully
func Stop() {
	shutdown()
}

var log *logtic.Source

// CommonSetup common setup methods
func CommonSetup() {
	fsSetup()
	initLogtic(isVerbose())
	StateSetup()
	migrateIfNeeded()
	LoadOptions()
}

func initLogtic(verbose bool) {
	logtic.Log.Level = logtic.LevelInfo
	if verbose {
		logtic.Log.Level = logtic.LevelDebug
	}
	logtic.Log.FilePath = path.Join(Directories.Logs, "radium.log")
	if err := logtic.Open(); err != nil {
		panic(err)
	}
	log = logtic.Connect("radium")
}

func startup() {
	CommonSetup()
	DataStoreSetup()
	CronSetup()
	checkFirstRun()
}

func shutdown() {
	State.Close()
	DataStoreTeardown()
	logtic.Close()
}
