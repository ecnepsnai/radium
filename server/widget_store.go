package server

import (
	"github.com/ecnepsnai/ds"
	"github.com/ecnepsnai/limits"
)

func (s widgetStoreObject) AllWidgets() ([]Widget, *Error) {
	objects, err := s.Table.GetAll(&ds.GetOptions{Ascending: false})

	if err != nil {
		log.Error("Error getting all widgets: %s", err.Error())
		return nil, ErrorFrom(err)
	}
	count := len(objects)
	if count == 0 {
		return []Widget{}, nil
	}

	var widgets = make([]Widget, count)
	for i, object := range objects {
		widget, ok := object.(Widget)
		if !ok {
			log.Error("Returned object was not type 'Widget'")
			return nil, ErrorServer("incorrect type")
		}
		widgets[i] = widget
	}

	return widgets, nil
}

func (s widgetStoreObject) WidgetWithID(id string) (*Widget, *Error) {
	object, err := s.Table.Get(id)
	if err != nil {
		log.Error("Error getting widget '%s': %s", id, err.Error())
		return nil, ErrorFrom(err)
	}
	if object == nil {
		log.Warn("No widget with id '%s' found", id)
		return nil, nil
	}

	widget, ok := object.(Widget)
	if !ok {
		log.Error("Returned object was not type 'Widget'")
		return nil, ErrorServer("incorrect type")
	}

	return &widget, nil
}

func (s widgetStoreObject) WidgetWithName(name string) (*Widget, *Error) {
	object, err := s.Table.Get(name)
	if err != nil {
		log.Error("Error getting widget '%s': %s", name, err.Error())
		return nil, ErrorFrom(err)
	}
	if object == nil {
		log.Warn("No widget with name '%s' found", name)
		return nil, nil
	}

	widget, ok := object.(Widget)
	if !ok {
		log.Error("Returned object was not type 'Widget'")
		return nil, ErrorServer("incorrect type")
	}

	return &widget, nil
}

// NewWidgetParameters parameters for adding a new widget
type NewWidgetParameters struct {
	Name string
	Type string
}

// Widget transform the parameters to an widget object
func (params NewWidgetParameters) Widget() Widget {
	widget := Widget{
		Name: params.Name,
		Type: params.Type,
	}
	return widget
}

func (s widgetStoreObject) New(params NewWidgetParameters) (*Widget, *Error) {
	existing, err := s.WidgetWithName(params.Name)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		log.Warn("Attempt to add duplicate widget with name '%s'", params.Name)
		return nil, ErrorUser("widget with name '%s' already exists", params.Name)
	}

	widget := params.Widget()
	widget.ID = NewID()

	if err := limits.Check(widget); err != nil {
		return nil, ErrorUser(err.Error())
	}

	if !IsWidgetType(widget.Type) {
		return nil, ErrorUser("Invalid widget type")
	}

	if err := widget.Save(); err != nil {
		return nil, err
	}

	return &widget, nil
}

// EditWidgetParameters parameters for editing an widget
type EditWidgetParameters struct {
	Name string
	Type string
}

func (s widgetStoreObject) Edit(id string, params EditWidgetParameters) (*Widget, *Error) {
	widget, err := s.WidgetWithID(id)
	if err != nil {
		return nil, err
	}
	if widget == nil {
		return nil, ErrorUser("widget '%s' not found", id)
	}

	widget.Name = params.Name
	widget.Type = params.Type

	if err := limits.Check(*widget); err != nil {
		return nil, ErrorUser(err.Error())
	}

	if !IsWidgetType(widget.Type) {
		return nil, ErrorUser("Invalid widget type")
	}

	if err := widget.Save(); err != nil {
		return nil, err
	}
	return widget, nil
}
