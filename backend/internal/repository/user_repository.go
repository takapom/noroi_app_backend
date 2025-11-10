package repository

import (
	"context"
	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"

	"github.com/google/uuid"
)

type UserRepository interface {
	// Create creates a new user
	Create(ctx context.Context, user *entity.User) error

	// FindByID finds a user by ID
	FindByID(ctx context.Context, id uuid.UUID) (*entity.User, error)

	// FindByEmail finds a user by email
	FindByEmail(ctx context.Context, email value.Email) (*entity.User, error)

	// Update updates an existing user
	Update(ctx context.Context, user *entity.User) error

	// Delete soft deletes a user
	Delete(ctx context.Context, id uuid.UUID) error

	// ExistsByEmail checks if a user with the given email exists
	ExistsByEmail(ctx context.Context, email value.Email) (bool, error)
}
