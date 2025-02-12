package server

import (
	"net/http"
	"strings"
	"time"

	"github.com/ecnepsnai/security"
	"github.com/ecnepsnai/web"
)

// Credentials describes credentials
type Credentials struct {
	Username string `limits:"32"`
	Password string `limits:"256"`
}

// AuthenticationResult describes the result for authentication
type AuthenticationResult struct {
	Session     Session
	CookieValue string
}

const (
	radiumSessionCookie = "radium-session"
)

// IsAuthenticated is there a valid user session for the given HTTP request.
// Returns a populated session object if valid, nil if invalid
func IsAuthenticated(r *http.Request) *Session {
	sessionCookie, _ := r.Cookie(radiumSessionCookie)
	return authenticateUser(sessionCookie)
}

func authenticateUser(sessionCookie *http.Cookie) *Session {
	if sessionCookie == nil {
		return nil
	}

	cookieComponents := strings.Split(sessionCookie.Value, "$")
	if len(cookieComponents) != 2 {
		log.Warn("Invalid radium session cookie")
		return nil
	}

	sessionID := cookieComponents[0]
	sessionHash := cookieComponents[1]

	session, err := SessionStore.SessionWithID(sessionID)
	if err != nil {
		log.Error("Error fetching session '%s': %s", sessionID, err.Message)
		return nil
	}
	if session == nil {
		log.Warn("No session with ID '%s' found", sessionID)
		return nil
	}

	if time.Now().Unix() >= session.Expires {
		log.Warn("Session expired: %d >= %d", time.Now().Unix(), session.Expires)
		return nil
	}

	trustedHash := security.HashSHA256String(session.Secret + session.Username)
	if trustedHash != sessionHash {
		log.Warn("Invalid radium session hash")
		log.Debug("'%s' != '%s'", trustedHash, sessionHash)
		return nil
	}

	user, err := UserStore.UserWithUsername(session.Username)
	if err != nil || user == nil {
		log.Warn("Session for non-existant user: '%s'", session.Username)
		return nil
	}

	// Update expires timestamp
	session.Expires = time.Now().Unix() + 7200
	SessionStore.SaveSession(session)

	return session
}

// AuthenticateUser authenticate a user
func AuthenticateUser(credentials Credentials, req *http.Request) (*AuthenticationResult, *web.Error) {
	user, err := UserStore.UserWithUsername(credentials.Username)
	if err != nil {
		return nil, web.CommonErrors.Unauthorized
	}
	if user == nil {
		return nil, web.CommonErrors.Unauthorized
	}

	if !user.Enabled {
		log.Warn("Attempted login from disabled user: '%s'", user.Username)
		return nil, web.CommonErrors.Unauthorized
	}

	if !user.PasswordHash.Compare([]byte(credentials.Password)) {
		log.Warn("Incorrect password provided for user: '%s'", user.Username)
		return nil, web.CommonErrors.Unauthorized
	}

	if upgradedPassword := user.PasswordHash.Upgrade([]byte(credentials.Password)); upgradedPassword != nil {
		user.PasswordHash = *upgradedPassword
		if err := UserStore.Table.Update(*user); err != nil {
			log.Error("Error upgrading user password: %s", err.Error())
		} else {
			log.Info("Upgraded password for user '%s'", user.Username)
		}
	}

	session, cookieValue, err := SessionStore.NewSessionForUser(user)
	if err != nil {
		if err.Server {
			log.Error("Error starting new session for user '%s': %s", user.Username, err.Message)
			return nil, web.CommonErrors.ServerError
		}

		return nil, web.ValidationError(err.Message)
	}

	result := AuthenticationResult{
		Session:     session,
		CookieValue: cookieValue,
	}

	return &result, nil
}
