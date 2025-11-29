package entity

import (
	"time"

	"github.com/google/uuid"
	"noroi/internal/domain/value"
)

// Application はユーザーごとの応募/保存単位の集約ルート。
// Company を参照し、カテゴリーや進捗、メモを保持する。
type Application struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	CompanyID   uuid.UUID
	Category    value.ApplicationCategory
	Status      value.ApplicationStatus
	ScheduledAt *time.Time
	ColorTag    value.ColorTag
	Completed   bool
	Motivation  string
	WhatToDo    string
	JobAxis     string
	Strengths   string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Stages      []SelectionStage
	Reminders   []Reminder
}

func NewApplication(userID, companyID uuid.UUID, category value.ApplicationCategory, status value.ApplicationStatus, scheduledAt *time.Time, colorTag value.ColorTag) *Application {
	now := time.Now()
	return &Application{
		ID:          uuid.New(),
		UserID:      userID,
		CompanyID:   companyID,
		Category:    category,
		Status:      status,
		ScheduledAt: scheduledAt,
		ColorTag:    colorTag,
		Completed:   false,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

func (a *Application) UpdateStatus(next value.ApplicationStatus) {
	a.Status = next
	if next == value.ApplicationStatusDone {
		a.Completed = true
	}
	a.UpdatedAt = time.Now()
}

func (a *Application) UpdateNotes(motivation, whatToDo, jobAxis, strengths string) {
	a.Motivation = motivation
	a.WhatToDo = whatToDo
	a.JobAxis = jobAxis
	a.Strengths = strengths
	a.UpdatedAt = time.Now()
}

func (a *Application) Reschedule(t *time.Time) {
	a.ScheduledAt = t
	a.UpdatedAt = time.Now()
}
