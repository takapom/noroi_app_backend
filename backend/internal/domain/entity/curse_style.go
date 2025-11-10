package entity

import (
	"time"
	"github.com/google/uuid"
)

type CurseStyle struct {
	ID          uuid.UUID
	Name        string // e.g., "炎獄の儀式"
	NameEn      string // e.g., "Infernal Rite"
	Description string
	IsSpecial   bool // 特別な呪癖（ポイントで解除）
	PointCost   int  // ポイントコスト（基本5種は0）
	CreatedAt   time.Time
}

func NewCurseStyle(name, nameEn, description string, isSpecial bool, pointCost int) *CurseStyle {
	return &CurseStyle{
		ID:          uuid.New(),
		Name:        name,
		NameEn:      nameEn,
		Description: description,
		IsSpecial:   isSpecial,
		PointCost:   pointCost,
		CreatedAt:   time.Now(),
	}
}
