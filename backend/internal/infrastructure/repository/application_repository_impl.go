package repository

import (
	"context"
	"database/sql"
	"fmt"

	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"
	repo "noroi/internal/repository"

	"github.com/google/uuid"
)

type applicationRepository struct {
	db *sql.DB
}

func NewApplicationRepository(db *sql.DB) repo.ApplicationRepository {
	return &applicationRepository{db: db}
}

func (r *applicationRepository) Create(ctx context.Context, app *entity.Application) error {
	query := `
		INSERT INTO applications (
			id, user_id, company_id, category, status, scheduled_at,
			color_tag, completed, motivation, what_to_do, job_axis, strengths,
			created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
	`

	_, err := r.db.ExecContext(ctx, query,
		app.ID,
		app.UserID,
		app.CompanyID,
		app.Category,
		app.Status,
		app.ScheduledAt,
		app.ColorTag,
		app.Completed,
		app.Motivation,
		app.WhatToDo,
		app.JobAxis,
		app.Strengths,
		app.CreatedAt,
		app.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert application: %w", err)
	}

	return nil
}

func (r *applicationRepository) Update(ctx context.Context, app *entity.Application) error {
	query := `
		UPDATE applications SET
			category = $1,
			status = $2,
			scheduled_at = $3,
			color_tag = $4,
			completed = $5,
			motivation = $6,
			what_to_do = $7,
			job_axis = $8,
			strengths = $9,
			updated_at = $10
		WHERE id = $11 AND user_id = $12
	`

	result, err := r.db.ExecContext(ctx, query,
		app.Category,
		app.Status,
		app.ScheduledAt,
		app.ColorTag,
		app.Completed,
		app.Motivation,
		app.WhatToDo,
		app.JobAxis,
		app.Strengths,
		app.UpdatedAt,
		app.ID,
		app.UserID,
	)
	if err != nil {
		return fmt.Errorf("update application: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("application not found or unauthorized")
	}

	return nil
}

func (r *applicationRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Application, error) {
	query := `
		SELECT
			id, user_id, company_id, category, status, scheduled_at,
			color_tag, completed, motivation, what_to_do, job_axis, strengths,
			created_at, updated_at
		FROM applications
		WHERE id = $1
	`

	var app entity.Application
	var scheduledAt sql.NullTime

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&app.ID,
		&app.UserID,
		&app.CompanyID,
		&app.Category,
		&app.Status,
		&scheduledAt,
		&app.ColorTag,
		&app.Completed,
		&app.Motivation,
		&app.WhatToDo,
		&app.JobAxis,
		&app.Strengths,
		&app.CreatedAt,
		&app.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("application not found")
	}
	if err != nil {
		return nil, fmt.Errorf("query application: %w", err)
	}

	if scheduledAt.Valid {
		app.ScheduledAt = &scheduledAt.Time
	}

	return &app, nil
}

func (r *applicationRepository) FindByUserAndCompany(ctx context.Context, userID, companyID uuid.UUID, category value.ApplicationCategory) (*entity.Application, error) {
	query := `
		SELECT
			id, user_id, company_id, category, status, scheduled_at,
			color_tag, completed, motivation, what_to_do, job_axis, strengths,
			created_at, updated_at
		FROM applications
		WHERE user_id = $1 AND company_id = $2 AND category = $3
	`

	var app entity.Application
	var scheduledAt sql.NullTime

	err := r.db.QueryRowContext(ctx, query, userID, companyID, category).Scan(
		&app.ID,
		&app.UserID,
		&app.CompanyID,
		&app.Category,
		&app.Status,
		&scheduledAt,
		&app.ColorTag,
		&app.Completed,
		&app.Motivation,
		&app.WhatToDo,
		&app.JobAxis,
		&app.Strengths,
		&app.CreatedAt,
		&app.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil // Not found is not an error
	}
	if err != nil {
		return nil, fmt.Errorf("query application: %w", err)
	}

	if scheduledAt.Valid {
		app.ScheduledAt = &scheduledAt.Time
	}

	return &app, nil
}
