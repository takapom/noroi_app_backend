package entity

import (
	"time"

	"github.com/google/uuid"
)

// Company は企業マスタ。
// ユーザー固有情報は持たず、Application から参照される。
type Company struct {
	ID             uuid.UUID
	Name           string
	RecruitmentURL *string
	Industry       *string
	Location       *string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func NewCompany(name string, recruitmentURL, industry, location *string) *Company {
	now := time.Now()
	return &Company{
		ID:             uuid.New(),
		Name:           name,
		RecruitmentURL: recruitmentURL,
		Industry:       industry,
		Location:       location,
		CreatedAt:      now,
		UpdatedAt:      now,
	}
}

func (c *Company) Update(name string, recruitmentURL, industry, location *string) {
	c.Name = name
	c.RecruitmentURL = recruitmentURL
	c.Industry = industry
	c.Location = location
	c.UpdatedAt = time.Now()
}
