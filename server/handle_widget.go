package server

import (
	"sort"

	"github.com/ecnepsnai/web"
)

func (h *handle) WidgetGetAll(request web.Request) (interface{}, *web.Error) {
	widgets, err := WidgetStore.AllWidgets()
	if err != nil {
		if err.Server {
			return nil, web.CommonErrors.ServerError
		}
		return nil, web.ValidationError(err.Message)
	}

	sort.Slice(widgets, func(i int, j int) bool {
		return widgets[i].Name < widgets[j].Name
	})

	return widgets, nil
}

func (h *handle) WidgetNew(request web.Request) (interface{}, *web.Error) {
	newWidgetRequest := NewWidgetParameters{}

	if err := request.Decode(&newWidgetRequest); err != nil {
		return nil, web.CommonErrors.BadRequest
	}

	widget, err := WidgetStore.New(newWidgetRequest)
	if err != nil {
		if err.Server {
			return nil, web.CommonErrors.ServerError
		}
		return nil, web.ValidationError(err.Message)
	}

	return *widget, nil
}

func (h *handle) WidgetGet(request web.Request) (interface{}, *web.Error) {
	id := request.Params.ByName("id")
	widget, err := WidgetStore.WidgetWithID(id)
	if err != nil {
		return nil, web.CommonErrors.BadRequest
	}
	if widget == nil {
		return nil, web.CommonErrors.NotFound
	}
	return *widget, nil
}

func (h *handle) WidgetEdit(request web.Request) (interface{}, *web.Error) {
	id := request.Params.ByName("id")
	editWidgetRequest := EditWidgetParameters{}

	if err := request.Decode(&editWidgetRequest); err != nil {
		return nil, web.CommonErrors.BadRequest
	}

	widget, err := WidgetStore.Edit(id, editWidgetRequest)
	if err != nil {
		if err.Server {
			return nil, web.CommonErrors.ServerError
		}
		return nil, web.ValidationError(err.Message)
	}

	return *widget, nil
}

func (h *handle) WidgetDelete(request web.Request) (interface{}, *web.Error) {
	id := request.Params.ByName("id")
	widget, err := WidgetStore.WidgetWithID(id)
	if err != nil {
		return nil, web.CommonErrors.BadRequest
	}
	if widget == nil {
		return nil, web.CommonErrors.NotFound
	}
	if err := widget.Delete(); err != nil {
		if err.Server {
			return nil, web.CommonErrors.ServerError
		}
		return nil, web.ValidationError(err.Message)
	}
	return true, nil
}
