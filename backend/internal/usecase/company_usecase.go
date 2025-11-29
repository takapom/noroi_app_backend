package usecase

import (
	"context"
	"errors"
	"strings"
	"time"

	"noroi/internal/domain/entity"
	"noroi/internal/repository"

	"github.com/google/uuid"
)

type CompanyUsecase struct {
	companyRepo repository.CompanyRepository
}

func NewCompanyUsecase(companyRepo repository.CompanyRepository) *CompanyUsecase {
	return &CompanyUsecase{companyRepo: companyRepo}
}

type CompanyListInput struct {
	Limit    int
	Offset   int
	FilterMy bool
	Category string
	Status   string
	Search   string
}

type CompanyResponse struct {
	ID             string  `json:"id"`
	Name           string  `json:"name"`
	RecruitmentURL *string `json:"recruitment_url,omitempty"`
	Industry       *string `json:"industry,omitempty"`
	Location       *string `json:"location,omitempty"`
}

type ApplicationSummary struct {
	ID          string  `json:"id"`
	Category    string  `json:"category"`
	Status      string  `json:"status"`
	ColorTag    string  `json:"color_tag"`
	ScheduledAt *string `json:"scheduled_at,omitempty"`
	Motivation  string  `json:"motivation,omitempty"`
	WhatToDo    string  `json:"what_to_do,omitempty"`
	JobAxis     string  `json:"job_axis,omitempty"`
	Strengths   string  `json:"strengths,omitempty"`
	UpdatedAt   string  `json:"updated_at,omitempty"`
}

type CompanyWithApplicationResponse struct {
	Company       CompanyResponse     `json:"company"`
	MyApplication *ApplicationSummary `json:"my_application,omitempty"`
}

type CreateCompanyInput struct {
	Name           string
	RecruitmentURL *string
	Industry       *string
	Location       *string
}

func (uc *CompanyUsecase) Create(ctx context.Context, input CreateCompanyInput) (*CompanyResponse, error) {
	if strings.TrimSpace(input.Name) == "" {
		return nil, errors.New("company name is required")
	}

	company := entity.NewCompany(input.Name, input.RecruitmentURL, input.Industry, input.Location)

	if err := uc.companyRepo.Create(ctx, company); err != nil {
		return nil, err
	}

	return &CompanyResponse{
		ID:             company.ID.String(),
		Name:           company.Name,
		RecruitmentURL: company.RecruitmentURL,
		Industry:       company.Industry,
		Location:       company.Location,
	}, nil
}

func (uc *CompanyUsecase) List(ctx context.Context, userID uuid.UUID, input CompanyListInput) ([]*CompanyWithApplicationResponse, error) {
	if userID == uuid.Nil {
		return nil, errors.New("user id is required")
	}

	query := repository.CompanyQuery{
		UserID:   userID,
		Limit:    input.Limit,
		Offset:   input.Offset,
		FilterMy: input.FilterMy,
	}

	if input.Category != "" {
		query.Category = strings.ToLower(input.Category)
	}
	if input.Status != "" {
		query.Status = strings.ToLower(input.Status)
	}
	if input.Search != "" {
		query.Search = input.Search
	}

	results, err := uc.companyRepo.FindWithUserApplication(ctx, query)
	if err != nil {
		return nil, err
	}

	res := make([]*CompanyWithApplicationResponse, 0, len(results))
	for _, item := range results {
		cr := CompanyResponse{
			ID:             item.Company.ID.String(),
			Name:           item.Company.Name,
			RecruitmentURL: item.Company.RecruitmentURL,
			Industry:       item.Company.Industry,
			Location:       item.Company.Location,
		}
		var ar *ApplicationSummary
		if item.Application != nil {
			var scheduled *string
			if item.Application.ScheduledAt != nil {
				s := item.Application.ScheduledAt.UTC().Format(time.RFC3339)
				scheduled = &s
			}
			updated := item.Application.UpdatedAt
			ar = &ApplicationSummary{
				ID:          item.Application.ID.String(),
				Category:    string(item.Application.Category),
				Status:      string(item.Application.Status),
				ColorTag:    string(item.Application.ColorTag),
				ScheduledAt: scheduled,
				Motivation:  item.Application.Motivation,
				WhatToDo:    item.Application.WhatToDo,
				JobAxis:     item.Application.JobAxis,
				Strengths:   item.Application.Strengths,
				UpdatedAt:   updated.Format(time.RFC3339),
			}
		}
		res = append(res, &CompanyWithApplicationResponse{
			Company:       cr,
			MyApplication: ar,
		})
	}

	return res, nil
}
