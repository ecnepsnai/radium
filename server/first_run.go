package server

var defaultUser = newUserParameters{
	Username: "admin",
	Email:    "admin@localhost",
	Password: "admin",
}

func isFirstRun() bool {
	numberOfUsers := 0

	users, err := UserStore.AllUsers()
	if err != nil {
		log.Fatal("Error creating default user: %s", err.Message)
	}
	numberOfUsers = len(users)

	return numberOfUsers == 0
}

func checkFirstRun() {
	if !isFirstRun() {
		return
	}

	if _, err := UserStore.NewUser(defaultUser); err != nil {
		log.Fatal("Unable to make default user: %s", err.Message)
	}
}
