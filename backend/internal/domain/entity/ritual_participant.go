package entity

import (
	"time"
	"github.com/google/uuid"
)

type RitualParticipant struct {
	ID          uuid.UUID
	RitualID    uuid.UUID
	UserID      uuid.UUID
	TotalDamage int
	PostCount   int
	CurseCount  int
	Rank        int // 1位, 2位, 3位...
	PointsEarned int
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func NewRitualParticipant(ritualID, userID uuid.UUID) *RitualParticipant {
	now := time.Now()
	return &RitualParticipant{
		ID:          uuid.New(),
		RitualID:    ritualID,
		UserID:      userID,
		TotalDamage: 0,
		PostCount:   0,
		CurseCount:  0,
		Rank:        0,
		PointsEarned: 0,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

func (rp *RitualParticipant) AddDamage(damage int, isPost bool) {
	rp.TotalDamage += damage
	if isPost {
		rp.PostCount++
	} else {
		rp.CurseCount++
	}
	rp.UpdatedAt = time.Now()
}

func (rp *RitualParticipant) SetRankAndPoints(rank int) {
	rp.Rank = rank
	
	// 報酬計算: 参加者全員50pt、1位500pt、2位300pt、3位100pt
	rp.PointsEarned = 50 // 基本報酬
	switch rank {
	case 1:
		rp.PointsEarned = 500
	case 2:
		rp.PointsEarned = 300
	case 3:
		rp.PointsEarned = 100
	}
	
	rp.UpdatedAt = time.Now()
}
