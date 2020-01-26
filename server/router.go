package server

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/ecnepsnai/web"
)

var bindAddress = "localhost:8080"

// RouterSetup set up the HTTP router
func RouterSetup() {
	server := web.New(bindAddress)

	handleOptions := web.HandleOptions{
		// 100KiB max
		MaxBodyLength: 102400,
	}

	staticPath := path.Join(Directories.Build, "static")
	server.HTTP.Static("/static/*filepath", staticPath)
	server.HTTP.Static(fmt.Sprintf("/radium%s/static/*filepath", ServerVersion), staticPath)

	h := handle{}
	v := view{}

	// Widgets
	server.API.GET("/api/widgets", h.WidgetGetAll, handleOptions)
	server.API.PUT("/api/widgets/widget", h.WidgetNew, handleOptions)
	server.API.GET("/api/widgets/widget/:id", h.WidgetGet, handleOptions)
	server.API.POST("/api/widgets/widget/:id", h.WidgetEdit, handleOptions)
	server.API.DELETE("/api/widgets/widget/:id", h.WidgetDelete, handleOptions)

	// Options
	server.API.GET("/api/options", h.OptionsGet, handleOptions)
	server.API.POST("/api/options", h.OptionsSet, handleOptions)

	// State
	server.API.GET("/api/state", h.StateGet, handleOptions)

	// Redirect
	server.HTTP.GET("/", v.Redirect, handleOptions)

	server.NotFoundHandler = func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(404)
		accept := r.Header.Get("Accept")
		if strings.Contains(accept, "application/json") {
			json.NewEncoder(w).Encode(web.CommonErrors.NotFound)
		} else {
			file, err := os.OpenFile(path.Join(Directories.Static, "build", "404.html"), os.O_RDONLY, os.ModePerm)
			defer file.Close()
			if err != nil {
				panic(err)
			}
			io.CopyBuffer(w, file, nil)
		}
	}

	ngRoutes := []string{
		"/widgets/",
		"/widgets/widget/",
		"/widgets/widget/:name/",
		"/widgets/widget/:name/edit/",
		"/widgets/find/",
		"/options/",
	}
	for _, route := range ngRoutes {
		server.HTTP.GET(route, v.AngularJS, handleOptions)
	}

	server.Start()
}
