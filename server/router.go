package server

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"strings"
	"time"

	"github.com/ecnepsnai/web"
)

var bindAddress = "localhost:8080"

// RouterSetup set up the HTTP router
func RouterSetup() {
	server := web.New(bindAddress)

	maxBodyLength := uint64(10240)

	authenticatedOptions := web.HandleOptions{
		AuthenticateMethod: func(request *http.Request) interface{} {
			return IsAuthenticated(request)
		},
		MaxBodyLength:      maxBodyLength,
		UnauthorizedMethod: unauthorizedHandle,
	}
	unauthenticatedOptions := web.HandleOptions{
		AuthenticateMethod: func(request *http.Request) interface{} {
			return 1
		},
		MaxBodyLength: maxBodyLength,
	}

	h := handle{}
	v := view{}

	server.HTTP.Static("/static/*filepath", Directories.Build)
	server.HTTP.Static(fmt.Sprintf("/radium%s/*filepath", ServerVersion), Directories.Build)

	// Authentication
	server.HTTP.GET("/login", v.Login, unauthenticatedOptions)
	server.API.POST("/api/login", h.Login, unauthenticatedOptions)
	server.API.POST("/api/logout", h.Logout, authenticatedOptions)

	// Widgets
	server.API.GET("/api/widgets", h.WidgetGetAll, authenticatedOptions)
	server.API.PUT("/api/widgets/widget", h.WidgetNew, authenticatedOptions)
	server.API.GET("/api/widgets/widget/:id", h.WidgetGet, authenticatedOptions)
	server.API.POST("/api/widgets/widget/:id", h.WidgetEdit, authenticatedOptions)
	server.API.DELETE("/api/widgets/widget/:id", h.WidgetDelete, authenticatedOptions)

	// State
	server.API.GET("/api/state", h.State, authenticatedOptions)

	// Users
	server.API.GET("/api/users", h.UserList, authenticatedOptions)
	server.API.PUT("/api/users/user", h.UserNew, authenticatedOptions)
	server.API.GET("/api/users/user/:username", h.UserGet, authenticatedOptions)
	server.API.POST("/api/users/user/:username", h.UserEdit, authenticatedOptions)
	server.API.DELETE("/api/users/user/:username", h.UserDelete, authenticatedOptions)

	// Options
	server.API.GET("/api/options", h.OptionsGet, authenticatedOptions)
	server.API.POST("/api/options", h.OptionsSet, authenticatedOptions)

	// Redirect
	server.HTTP.GET("/", v.Redirect, unauthenticatedOptions)

	server.HTTP.GET("/favicon.ico", v.Favicon, unauthenticatedOptions)

	server.NotFoundHandler = func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(404)
		notFoundFile := path.Join(Directories.Build, "404.html")
		accept := r.Header.Get("Accept")
		if strings.Contains(accept, "application/json") {
			json.NewEncoder(w).Encode(web.CommonErrors.NotFound)
		} else if FileExists(notFoundFile) {
			file, err := os.OpenFile(path.Join(Directories.Build, "404.html"), os.O_RDONLY, os.ModePerm)
			defer file.Close()
			if err != nil {
				panic(err)
			}
			io.CopyBuffer(w, file, nil)
		} else {
			w.Write([]byte("not found"))
		}
	}

	ngRoutes := []string{
		"/widgets",
		"/widgets/widget",
		"/widgets/widget/:id",
		"/widgets/widget/:id/edit",
		"/options",
	}
	for _, route := range ngRoutes {
		server.HTTP.GET(route, v.JavaScript, authenticatedOptions)
	}

	server.Start()
}

func unauthorizedHandle(w http.ResponseWriter, request *http.Request) {
	if strings.Contains(request.Header.Get("Accept"), "text/html") {
		w.Header().Add("Location", "/login?unauthorized&redirect="+request.URL.Path)
		cookie := http.Cookie{
			Name:    radiumSessionCookie,
			Value:   "",
			Path:    "/",
			Expires: time.Now().AddDate(0, 0, -1),
		}
		http.SetCookie(w, &cookie)
		w.WriteHeader(307)
		return
	}

	w.WriteHeader(403)
	w.Write([]byte("{\"error\":{\"code\":403,\"message\":\"unauthorized\"}}"))
	return
}
