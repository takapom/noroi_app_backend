package entity

import (
	"time"

	"github.com/google/uuid"
	"noroi/internal/domain/value"
)

// Reminder は将来のリマインド機能用のエンティティ。
type Reminder struct {
	ID            uuid.UUID
	ApplicationID uuid.UUID
	TargetAt      time.Time
	Channel       value.ReminderChannel
	Message       string
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func NewReminder(applicationID uuid.UUID, targetAt time.Time, channel value.ReminderChannel, message string) *Reminder {
	now := time.Now()
	return &Reminder{
		ID:            uuid.New(),
		ApplicationID: applicationID,
		TargetAt:      targetAt,
		Channel:       channel,
		Message:       message,
		CreatedAt:     now,
		UpdatedAt:     now,
	}
}
