package repository

import (
	"context"
	"noroi/internal/domain/entity"
	"time"

	"github.com/google/uuid"
)

type RitualRepository interface {
	// Create creates a new ritual
	Create(ctx context.Context, ritual *entity.Ritual) error

	// FindByID finds a ritual by ID
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Ritual, error)

	// FindActiveRitual finds the currently active ritual (if any)
	FindActiveRitual(ctx context.Context, now time.Time) (*entity.Ritual, error)

	// Update updates an existing ritual
	Update(ctx context.Context, ritual *entity.Ritual) error

	// CreateParticipant adds a participant to a ritual
	CreateParticipant(ctx context.Context, participant *entity.RitualParticipant) error

	// FindParticipants retrieves all participants for a ritual
	FindParticipants(ctx context.Context, ritualID uuid.UUID) ([]*entity.RitualParticipant, error)

	// ParticipantExists checks if a user is already a participant in a ritual
	ParticipantExists(ctx context.Context, ritualID, userID uuid.UUID) (bool, error)
}
