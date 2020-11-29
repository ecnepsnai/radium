package server

var defaultUser = newUserParameters{
	Username: "admin",
	Email:    "admin@localhost",
	Password: "admin",
}

func atLeastOneUser() bool {
	users, err := UserStore.AllUsers()
	if err != nil {
		panic(err)
	}
	return len(users) > 0
}

func checkFirstRun() {
	if !atLeastOneUser() {
		log.Warn("Creating default user")
		_, err := UserStore.NewUser(defaultUser)
		if err != nil {
			log.Fatal("Unable to make default user: %s", err.Message)
		}
	}
}
