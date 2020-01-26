package server

import (
	"os"

	"github.com/ecnepsnai/web"
)

func (h *handle) StateGet(request web.Request) (interface{}, *web.Error) {
	type stateType struct {
		Options  E6Options
		Hostname string
		Version  string
	}

	hostname, _ := os.Hostname()
	state := stateType{
		Options:  *Options,
		Hostname: hostname,
		Version:  ServerVersion,
	}

	return state, nil
}
