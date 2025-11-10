package entity

import (
	"time"
	"noroi/pkg/errors"
	"github.com/google/uuid"
)

type RitualStatus string

const (
	RitualStatusPending   RitualStatus = "pending"   // 待機中
	RitualStatusActive    RitualStatus = "active"    // 進行中
	RitualStatusSuccess   RitualStatus = "success"   // 成功
	RitualStatusFailed    RitualStatus = "failed"    // 失敗
)

type Ritual struct {
	ID               uuid.UUID
	MaxHP            int          // 300,000固定
	CurrentHP        int
	Status           RitualStatus
	ParticipantCount int
	StartTime        time.Time    // 2:00 AM
	EndTime          time.Time    // 3:00 AM
	CreatedAt        time.Time
	UpdatedAt        time.Time
	CompletedAt      *time.Time
}

func NewRitual(date time.Time) *Ritual {
	// 指定日の2:00 AMに開始、3:00 AMに終了
	startTime := time.Date(date.Year(), date.Month(), date.Day(), 2, 0, 0, 0, date.Location())
	endTime := startTime.Add(time.Hour)
	
	now := time.Now()
	return &Ritual{
		ID:               uuid.New(),
		MaxHP:            300000,
		CurrentHP:        300000,
		Status:           RitualStatusPending,
		ParticipantCount: 0,
		StartTime:        startTime,
		EndTime:          endTime,
		CreatedAt:        now,
		UpdatedAt:        now,
	}
}

func (r *Ritual) Start() error {
	if r.Status != RitualStatusPending {
		return errors.ErrRitualAlreadyEnded
	}
	
	r.Status = RitualStatusActive
	r.UpdatedAt = time.Now()
	return nil
}

func (r *Ritual) TakeDamage(damage int, isCritical bool) int {
	actualDamage := damage
	if isCritical {
		actualDamage = damage * 2
	}
	
	r.CurrentHP -= actualDamage
	if r.CurrentHP < 0 {
		r.CurrentHP = 0
	}
	
	r.UpdatedAt = time.Now()
	return actualDamage
}

func (r *Ritual) IncrementParticipant() {
	r.ParticipantCount++
	r.UpdatedAt = time.Now()
}

func (r *Ritual) Complete() error {
	if r.Status != RitualStatusActive {
		return errors.ErrRitualNotActive
	}
	
	now := time.Now()
	if r.CurrentHP <= 0 {
		r.Status = RitualStatusSuccess
	} else {
		r.Status = RitualStatusFailed
	}
	
	r.CompletedAt = &now
	r.UpdatedAt = now
	return nil
}

func (r *Ritual) IsActive() bool {
	now := time.Now()
	return r.Status == RitualStatusActive && now.After(r.StartTime) && now.Before(r.EndTime)
}
