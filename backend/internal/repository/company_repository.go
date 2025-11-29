package repository

import (
	"context"

	"noroi/internal/domain/entity"

	"github.com/google/uuid"
)

type CompanyQuery struct {
	UserID   uuid.UUID
	Limit    int
	Offset   int
	FilterMy bool
	Category string // optional: main|intern|info
	Status   string // optional: todo|scheduled|in_progress|done|withdrawn
	Search   string // optional: partial match on company name
}

type CompanyWithApplication struct {
	Company     *entity.Company
	Application *entity.Application // nil if none
}

type CompanyRepository interface {
	FindWithUserApplication(ctx context.Context, query CompanyQuery) ([]*CompanyWithApplication, error)
	Create(ctx context.Context, company *entity.Company) error
}
