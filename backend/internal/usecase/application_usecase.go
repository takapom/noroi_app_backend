package usecase

import (
	"context"
	"errors"
	"strings"
	"time"

	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"
	"noroi/internal/repository"

	"github.com/google/uuid"
)

type ApplicationUsecase struct {
	appRepo     repository.ApplicationRepository
	companyRepo repository.CompanyRepository
}

func NewApplicationUsecase(appRepo repository.ApplicationRepository, companyRepo repository.CompanyRepository) *ApplicationUsecase {
	return &ApplicationUsecase{
		appRepo:     appRepo,
		companyRepo: companyRepo,
	}
}

type CreateApplicationInput struct {
	CompanyID   string
	Category    string
	Status      string
	ColorTag    string
	ScheduledAt *string
	Motivation  string
	WhatToDo    string
	JobAxis     string
	Strengths   string
}

type UpdateApplicationInput struct {
	Category    string
	Status      string
	ColorTag    string
	ScheduledAt *string
	Motivation  string
	WhatToDo    string
	JobAxis     string
	Strengths   string
}

type ApplicationResponse struct {
	ID          string  `json:"id"`
	UserID      string  `json:"user_id"`
	CompanyID   string  `json:"company_id"`
	Category    string  `json:"category"`
	Status      string  `json:"status"`
	ScheduledAt *string `json:"scheduled_at,omitempty"`
	ColorTag    string  `json:"color_tag"`
	Completed   bool    `json:"completed"`
	Motivation  string  `json:"motivation"`
	WhatToDo    string  `json:"what_to_do"`
	JobAxis     string  `json:"job_axis"`
	Strengths   string  `json:"strengths"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}

func (uc *ApplicationUsecase) Create(ctx context.Context, userID uuid.UUID, input CreateApplicationInput) (*ApplicationResponse, error) {
	if userID == uuid.Nil {
		return nil, errors.New("user id is required")
	}

	// Parse company ID
	companyID, err := uuid.Parse(input.CompanyID)
	if err != nil {
		return nil, errors.New("invalid company id")
	}

	// Validate category
	category := value.ApplicationCategory(strings.ToLower(input.Category))
	if err := category.Validate(); err != nil {
		return nil, errors.New("invalid category")
	}

	// Check if application already exists
	existing, err := uc.appRepo.FindByUserAndCompany(ctx, userID, companyID, category)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("application already exists for this company and category")
	}

	// Validate status
	status := value.ApplicationStatusToDo
	if input.Status != "" {
		status = value.ApplicationStatus(strings.ToLower(input.Status))
		if err := status.Validate(); err != nil {
			return nil, errors.New("invalid status")
		}
	}

	// Validate color tag
	colorTag := value.ColorTagOrange
	if input.ColorTag != "" {
		colorTag = value.ColorTag(strings.ToLower(input.ColorTag))
		if err := colorTag.Validate(); err != nil {
			return nil, errors.New("invalid color tag")
		}
	}

	// Parse scheduled time
	var scheduledAt *time.Time
	if input.ScheduledAt != nil && *input.ScheduledAt != "" {
		t, err := time.Parse(time.RFC3339, *input.ScheduledAt)
		if err != nil {
			return nil, errors.New("invalid scheduled_at format")
		}
		scheduledAt = &t
	}

	// Create application
	app := entity.NewApplication(userID, companyID, category, status, scheduledAt, colorTag)
	app.UpdateNotes(input.Motivation, input.WhatToDo, input.JobAxis, input.Strengths)

	if err := uc.appRepo.Create(ctx, app); err != nil {
		return nil, err
	}

	return uc.toResponse(app), nil
}

func (uc *ApplicationUsecase) Update(ctx context.Context, userID, appID uuid.UUID, input UpdateApplicationInput) (*ApplicationResponse, error) {
	if userID == uuid.Nil {
		return nil, errors.New("user id is required")
	}

	// Find existing application
	app, err := uc.appRepo.FindByID(ctx, appID)
	if err != nil {
		return nil, err
	}
	if app == nil {
		return nil, errors.New("application not found")
	}

	// Check ownership
	if app.UserID != userID {
		return nil, errors.New("unauthorized")
	}

	// Update category if provided
	if input.Category != "" {
		category := value.ApplicationCategory(strings.ToLower(input.Category))
		if err := category.Validate(); err != nil {
			return nil, errors.New("invalid category")
		}
		app.Category = category
	}

	// Update status if provided
	if input.Status != "" {
		status := value.ApplicationStatus(strings.ToLower(input.Status))
		if err := status.Validate(); err != nil {
			return nil, errors.New("invalid status")
		}
		app.UpdateStatus(status)
	}

	// Update color tag if provided
	if input.ColorTag != "" {
		colorTag := value.ColorTag(strings.ToLower(input.ColorTag))
		if err := colorTag.Validate(); err != nil {
			return nil, errors.New("invalid color tag")
		}
		app.ColorTag = colorTag
	}

	// Update scheduled time
	if input.ScheduledAt != nil {
		if *input.ScheduledAt == "" {
			app.Reschedule(nil)
		} else {
			t, err := time.Parse(time.RFC3339, *input.ScheduledAt)
			if err != nil {
				return nil, errors.New("invalid scheduled_at format")
			}
			app.Reschedule(&t)
		}
	}

	// Update notes
	app.UpdateNotes(input.Motivation, input.WhatToDo, input.JobAxis, input.Strengths)

	if err := uc.appRepo.Update(ctx, app); err != nil {
		return nil, err
	}

	return uc.toResponse(app), nil
}

func (uc *ApplicationUsecase) toResponse(app *entity.Application) *ApplicationResponse {
	var scheduledAt *string
	if app.ScheduledAt != nil {
		s := app.ScheduledAt.UTC().Format(time.RFC3339)
		scheduledAt = &s
	}

	return &ApplicationResponse{
		ID:          app.ID.String(),
		UserID:      app.UserID.String(),
		CompanyID:   app.CompanyID.String(),
		Category:    string(app.Category),
		Status:      string(app.Status),
		ScheduledAt: scheduledAt,
		ColorTag:    string(app.ColorTag),
		Completed:   app.Completed,
		Motivation:  app.Motivation,
		WhatToDo:    app.WhatToDo,
		JobAxis:     app.JobAxis,
		Strengths:   app.Strengths,
		CreatedAt:   app.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   app.UpdatedAt.Format(time.RFC3339),
	}
}
