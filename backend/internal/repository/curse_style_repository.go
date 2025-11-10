package repository

import (
	"context"
	"noroi/internal/domain/entity"

	"github.com/google/uuid"
)

type CurseStyleRepository interface {
	// FindAll retrieves all curse styles
	FindAll(ctx context.Context) ([]*entity.CurseStyle, error)

	// FindByID finds a curse style by ID
	FindByID(ctx context.Context, id uuid.UUID) (*entity.CurseStyle, error)

	// FindByNameEn finds a curse style by English name
	FindByNameEn(ctx context.Context, nameEn string) (*entity.CurseStyle, error)

	// FindBasicStyles retrieves only basic (non-special) curse styles
	FindBasicStyles(ctx context.Context) ([]*entity.CurseStyle, error)
}
