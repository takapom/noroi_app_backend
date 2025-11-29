package domain_service

import (
	"time"

	"github.com/google/uuid"
	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"
)

// ReminderService はリマインドの生成を行うスタブ。
type ReminderService struct{}

func (ReminderService) Build(app entity.Application, channel value.ReminderChannel, message string, target time.Time) entity.Reminder {
	return entity.Reminder{
		ID:            uuid.New(),
		ApplicationID: app.ID,
		TargetAt:      target,
		Channel:       channel,
		Message:       message,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
}
