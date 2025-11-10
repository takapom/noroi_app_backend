package repository

import (
	"context"
	"noroi/internal/domain/entity"
	"time"
)

type RankingRepository interface {
	// Create creates a new ranking entry
	Create(ctx context.Context, ranking *entity.Ranking) error

	// FindByPeriod retrieves rankings for a specific period
	FindByPeriod(ctx context.Context, period entity.RankingPeriod, startTime, endTime time.Time, limit int) ([]*entity.Ranking, error)

	// FindCurrentWeekly retrieves current weekly rankings
	FindCurrentWeekly(ctx context.Context, limit int) ([]*entity.Ranking, error)

	// UpsertRanking creates or updates a ranking entry
	UpsertRanking(ctx context.Context, ranking *entity.Ranking) error

	// DeleteByPeriod deletes rankings for a specific period
	DeleteByPeriod(ctx context.Context, period entity.RankingPeriod, startTime, endTime time.Time) error
}
