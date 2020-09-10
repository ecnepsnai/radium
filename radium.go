package main

import (
	"fmt"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"

	"github.com/ecnepsnai/radium/server"
)

func main() {
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		stop()
	}()
	start()
}

func start() {
	fmt.Printf("radium %s (Runtime %s). Copyright Ian Spence 2020-%d - All rights reserved.\n", server.ServerVersion, runtime.Version(), time.Now().Year())
	server.Start()
	stop()
}

func stop() {
	fmt.Printf("Shutting down\n")
	server.Stop()
	os.Exit(1)
}
