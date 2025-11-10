package entity

import (
	"time"
	"github.com/google/uuid"
)

type RankingPeriod string

const (
	RankingPeriodWeekly  RankingPeriod = "weekly"
	RankingPeriodMonthly RankingPeriod = "monthly"
	RankingPeriodAllTime RankingPeriod = "all_time"
)

type Ranking struct {
	ID         uuid.UUID
	UserID     uuid.UUID
	Period     RankingPeriod
	Rank       int
	CurseCount int
	PostCount  int
	PeriodStart time.Time
	PeriodEnd   *time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

func NewRanking(userID uuid.UUID, period RankingPeriod, rank, curseCount, postCount int, periodStart time.Time) *Ranking {
	now := time.Now()
	return &Ranking{
		ID:          uuid.New(),
		UserID:      userID,
		Period:      period,
		Rank:        rank,
		CurseCount:  curseCount,
		PostCount:   postCount,
		PeriodStart: periodStart,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

func (r *Ranking) UpdateRank(rank, curseCount int) {
	r.Rank = rank
	r.CurseCount = curseCount
	r.UpdatedAt = time.Now()
}

func (r *Ranking) Close(periodEnd time.Time) {
	r.PeriodEnd = &periodEnd
	r.UpdatedAt = time.Now()
}
