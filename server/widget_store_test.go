package server

import "testing"

func TestWidgetStoreGet(t *testing.T) {
	WidgetStore.Table.DeleteAll()

	nameBefore := randomString(12)
	nameAfter := randomString(12)

	widget, _ := WidgetStore.New(NewWidgetParameters{
		Name: nameBefore,
	})
	WidgetStore.Edit(widget.ID, EditWidgetParameters{
		Name: nameAfter,
	})
	WidgetStore.New(NewWidgetParameters{
		Name: randomString(12),
	})

	widgets, err := WidgetStore.AllWidgets()
	if err != nil {
		t.Errorf("Error getting all widgets: %s", err.Message)
	}

	if len(widgets) != 2 {
		t.Errorf("Incorrect number of widgets returned. Expected 2 got %d", len(widgets))
	}

	if widgets[0].Name != nameAfter {
		t.Errorf("Incorrect name for widget. Expected '%s' got '%s'", nameAfter, widgets[0].Name)
	}
}
