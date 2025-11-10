package entity

import (
	"time"
	"noroi/internal/domain/value"
	"github.com/google/uuid"
)

type Gender string

const (
	GenderMale    Gender = "male"
	GenderFemale  Gender = "female"
	GenderUnknown Gender = "unknown"
)

type User struct {
	ID              uuid.UUID
	Email           value.Email
	Password        value.Password
	Username        string
	Age             int
	Gender          Gender
	CurseStyleID    uuid.UUID
	Points          int
	ProfilePublic   bool
	NotifyCurse     bool
	NotifyRitual    bool
	IsDeleted       bool
	CreatedAt       time.Time
	UpdatedAt       time.Time
	DeletedAt       *time.Time
}

func NewUser(email value.Email, password value.Password, username string, age int, gender Gender, curseStyleID uuid.UUID) *User {
	now := time.Now()
	return &User{
		ID:            uuid.New(),
		Email:         email,
		Password:      password,
		Username:      username,
		Age:           age,
		Gender:        gender,
		CurseStyleID:  curseStyleID,
		Points:        0,
		ProfilePublic: true,
		NotifyCurse:   true,
		NotifyRitual:  true,
		IsDeleted:     false,
		CreatedAt:     now,
		UpdatedAt:     now,
	}
}

func (u *User) UpdateProfile(username string, age int, gender Gender) {
	u.Username = username
	u.Age = age
	u.Gender = gender
	u.UpdatedAt = time.Now()
}

func (u *User) ChangeCurseStyle(curseStyleID uuid.UUID) {
	u.CurseStyleID = curseStyleID
	u.UpdatedAt = time.Now()
}

func (u *User) AddPoints(points int) {
	u.Points += points
	u.UpdatedAt = time.Now()
}

func (u *User) Delete() {
	now := time.Now()
	u.IsDeleted = true
	u.DeletedAt = &now
	u.UpdatedAt = now
}
