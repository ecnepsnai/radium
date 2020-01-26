package server

import (
	"github.com/ecnepsnai/web"
)

func (h *handle) OptionsGet(request web.Request) (interface{}, *web.Error) {
	return Options, nil
}

func (h *handle) OptionsSet(request web.Request) (interface{}, *web.Error) {
	options := E6Options{}

	if err := request.Decode(&options); err != nil {
		return nil, web.CommonErrors.BadRequest
	}

	if err := options.Save(); err != nil {
		return nil, web.CommonErrors.ServerError
	}

	return options, nil
}
