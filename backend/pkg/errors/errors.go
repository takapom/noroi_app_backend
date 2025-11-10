package errors

import "errors"

var (
	// Domain errors
	ErrInvalidEmail        = errors.New("invalid email format")
	ErrInvalidPassword     = errors.New("invalid password format")
	ErrPasswordTooShort    = errors.New("password must be at least 8 characters")
	ErrInvalidUsername     = errors.New("invalid username format")
	ErrUsernameTooLong     = errors.New("username must be 50 characters or less")
	
	// Post errors
	ErrPostTooShort        = errors.New("post content must be at least 10 characters")
	ErrPostTooLong         = errors.New("post content must be 300 characters or less")
	ErrInvalidPostType     = errors.New("invalid post type")
	ErrCannotEditPost      = errors.New("cannot edit post")
	ErrCannotDeletePost    = errors.New("cannot delete post")
	
	// Curse (Like) errors
	ErrAlreadyCursed       = errors.New("already cursed this post")
	ErrCannotCurseSelf     = errors.New("cannot curse own post")
	ErrCurseNotFound       = errors.New("curse not found")
	
	// Ritual errors
	ErrRitualNotActive     = errors.New("ritual is not active")
	ErrAnonymousCannotJoin = errors.New("anonymous users cannot join ritual")
	ErrRitualAlreadyEnded  = errors.New("ritual already ended")
	
	// Auth errors
	ErrUnauthorized        = errors.New("unauthorized")
	ErrInvalidToken        = errors.New("invalid token")
	ErrTokenExpired        = errors.New("token expired")
	
	// Repository errors
	ErrNotFound            = errors.New("not found")
	ErrAlreadyExists       = errors.New("already exists")
	ErrDatabaseError       = errors.New("database error")
	ErrUserNotFound        = errors.New("user not found")
	ErrPostNotFound        = errors.New("post not found")
	ErrCurseStyleNotFound  = errors.New("curse style not found")
	ErrEmailAlreadyExists  = errors.New("email already exists")
	ErrInvalidCredentials  = errors.New("invalid credentials")
)
