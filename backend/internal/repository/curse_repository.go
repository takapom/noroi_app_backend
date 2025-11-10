package repository

import (
	"context"
	"noroi/internal/domain/entity"

	"github.com/google/uuid"
)

type CurseRepository interface {
	// Create creates a new curse (like)
	Create(ctx context.Context, curse *entity.Curse) error

	// Delete deletes a curse
	Delete(ctx context.Context, userID, postID uuid.UUID) error

	// Exists checks if a curse already exists for a user and post
	Exists(ctx context.Context, userID, postID uuid.UUID) (bool, error)

	// FindByPostID retrieves all curses for a specific post
	FindByPostID(ctx context.Context, postID uuid.UUID) ([]*entity.Curse, error)

	// CountByPostID counts curses for a specific post
	CountByPostID(ctx context.Context, postID uuid.UUID) (int, error)
}
