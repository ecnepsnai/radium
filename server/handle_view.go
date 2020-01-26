package server

import (
	"os"
	"path"

	"github.com/ecnepsnai/web"
)

func (v *view) Redirect(request web.Request) (response web.Response) {
	response.Headers = map[string]string{
		"Location": "/widgets/",
	}
	response.Status = 307
	return
}

func (v *view) AngularJS(request web.Request) web.Response {
	file, err := os.OpenFile(path.Join(Directories.Static, "build", "ng.html"), os.O_RDONLY, os.ModePerm)
	if err != nil {
		panic(err)
	}
	return web.Response{
		Reader: file,
	}
}
