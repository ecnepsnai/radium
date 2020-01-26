package server

import (
	"github.com/ecnepsnai/limits"
)

// Widget describes an widget
type Widget struct {
	ID   string `ds:"primary"`
	Name string `ds:"unique" min:"1" max:"64"`
}

// Save will save an existing widget
func (a *Widget) Save() *Error {
	if err := limits.Check(a); err != nil {
		return ErrorUser(err.Error())
	}

	if err := WidgetStore.Table.Update(*a); err != nil {
		log.Error("Error updating widget '%s': %s", a.Name, err.Error())
		return ErrorFrom(err)
	}
	log.Info("Updated widget '%s'", a.Name)
	return nil
}

// Delete will delete an widget
func (a *Widget) Delete() *Error {
	if err := WidgetStore.Table.Delete(*a); err != nil {
		log.Error("Error deleting widget '%s': %s", a.Name, err.Error())
		return ErrorFrom(err)
	}
	log.Info("Deleted widget '%s'", a.Name)
	return nil
}
