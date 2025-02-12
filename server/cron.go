package server

import (
	"github.com/ecnepsnai/cron"
	"github.com/ecnepsnai/logtic"
)

var cronDisabled = false

// CronSetup start the cron
func CronSetup() {
	schedule, _ := cron.New([]cron.Job{
		{
			Pattern: "0 * * * *",
			Name:    "CleanupSessions",
			Exec: func() {
				SessionStore.CleanupSessions()
			},
		},
		{
			Pattern: "1 0 * * *",
			Name:    "RotateLogs",
			Exec: func() {
				logtic.Rotate()
			},
		},
	})
	if !cronDisabled {
		go schedule.Start()
	}
}
