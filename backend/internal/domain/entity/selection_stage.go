package entity

import (
	"time"

	"github.com/google/uuid"
	"noroi/internal/domain/value"
)

// SelectionStage は応募ごとの選考ステップ。
type SelectionStage struct {
	ID            uuid.UUID
	ApplicationID uuid.UUID
	Name          string
	ScheduledAt   *time.Time
	Status        value.SelectionStageStatus
	Notes         *string
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func NewSelectionStage(applicationID uuid.UUID, name string, scheduledAt *time.Time, status value.SelectionStageStatus, notes *string) *SelectionStage {
	now := time.Now()
	return &SelectionStage{
		ID:            uuid.New(),
		ApplicationID: applicationID,
		Name:          name,
		ScheduledAt:   scheduledAt,
		Status:        status,
		Notes:         notes,
		CreatedAt:     now,
		UpdatedAt:     now,
	}
}

func (s *SelectionStage) UpdateStatus(status value.SelectionStageStatus) {
	s.Status = status
	s.UpdatedAt = time.Now()
}

func (s *SelectionStage) Reschedule(t *time.Time) {
	s.ScheduledAt = t
	s.UpdatedAt = time.Now()
}
