package repository

import (
	"context"

	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"

	"github.com/google/uuid"
)

type ApplicationRepository interface {
	Create(ctx context.Context, app *entity.Application) error
	Update(ctx context.Context, app *entity.Application) error
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Application, error)
	FindByUserAndCompany(ctx context.Context, userID, companyID uuid.UUID, category value.ApplicationCategory) (*entity.Application, error)
}
