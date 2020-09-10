package server

import (
	"os"
	"runtime"

	"github.com/ecnepsnai/web"
)

func (h *handle) State(request web.Request) (interface{}, *web.Error) {
	type runtimeType struct {
		ServerFQDN string
		Version    string
		Config     string
	}
	type stateType struct {
		Runtime runtimeType
		User    *User
		Enums   map[string]interface{}
		Options *radiumOptions
	}

	hostname, _ := os.Hostname()
	user := request.UserData.(*Session).User()

	s := stateType{
		Runtime: runtimeType{
			ServerFQDN: hostname,
			Version:    ServerVersion,
			Config:     runtime.GOOS + "_" + runtime.GOARCH,
		},
		User:    user,
		Enums:   AllEnums,
		Options: Options,
	}

	return s, nil
}
