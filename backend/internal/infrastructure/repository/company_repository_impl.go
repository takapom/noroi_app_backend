package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"
	repo "noroi/internal/repository"

	"github.com/google/uuid"
)

type companyRepository struct {
	db *sql.DB
}

func NewCompanyRepository(db *sql.DB) repo.CompanyRepository {
	return &companyRepository{db: db}
}

func (r *companyRepository) FindWithUserApplication(ctx context.Context, q repo.CompanyQuery) ([]*repo.CompanyWithApplication, error) {
	params := []interface{}{q.UserID}
	where := []string{}
	joinConditions := []string{"a.company_id = c.id", "a.user_id = $1"}

	if q.FilterMy {
		where = append(where, "a.user_id IS NOT NULL")
	}
	if q.Category != "" {
		params = append(params, q.Category)
		joinConditions = append(joinConditions, fmt.Sprintf("a.category = $%d", len(params)))
	}
	if q.Status != "" {
		params = append(params, q.Status)
		joinConditions = append(joinConditions, fmt.Sprintf("a.status = $%d", len(params)))
	}
	if q.Search != "" {
		params = append(params, "%"+q.Search+"%")
		where = append(where, fmt.Sprintf("c.name ILIKE $%d", len(params)))
	}

	// limit & offset
	limit := q.Limit
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	offset := q.Offset
	if offset < 0 {
		offset = 0
	}
	params = append(params, limit, offset)

	whereClause := ""
	if len(where) > 0 {
		whereClause = "WHERE " + strings.Join(where, " AND ")
	}

	query := `
SELECT
  c.id, c.name, c.recruitment_url, c.industry, c.location, c.created_at, c.updated_at,
  a.id, a.category, a.status, a.scheduled_at, a.color_tag, a.completed,
  a.motivation, a.what_to_do, a.job_axis, a.strengths, a.created_at, a.updated_at
FROM companies c
LEFT JOIN applications a
  ON ` + strings.Join(joinConditions, " AND ") + `
` + whereClause + `
ORDER BY c.name
LIMIT $` + fmt.Sprintf("%d", len(params)-1) + ` OFFSET $` + fmt.Sprintf("%d", len(params))

	rows, err := r.db.QueryContext(ctx, query, params...)
	if err != nil {
		return nil, fmt.Errorf("query companies: %w", err)
	}
	defer rows.Close()

	var results []*repo.CompanyWithApplication

	for rows.Next() {
		var (
			c            entity.Company
			appID        sql.NullString
			category     sql.NullString
			status       sql.NullString
			scheduledAt  sql.NullTime
			colorTag     sql.NullString
			completed    sql.NullBool
			motivation   sql.NullString
			whatToDo     sql.NullString
			jobAxis      sql.NullString
			strengths    sql.NullString
			appCreatedAt sql.NullTime
			appUpdatedAt sql.NullTime
		)

		err = rows.Scan(
			&c.ID, &c.Name, &c.RecruitmentURL, &c.Industry, &c.Location, &c.CreatedAt, &c.UpdatedAt,
			&appID, &category, &status, &scheduledAt, &colorTag, &completed,
			&motivation, &whatToDo, &jobAxis, &strengths, &appCreatedAt, &appUpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan companies: %w", err)
		}

		var app *entity.Application
		if appID.Valid {
			appUUID, _ := uuid.Parse(appID.String)
			app = &entity.Application{
				ID:          appUUID,
				UserID:      q.UserID,
				CompanyID:   c.ID,
				Category:    value.ApplicationCategory(category.String),
				Status:      value.ApplicationStatus(status.String),
				ScheduledAt: nil,
				ColorTag:    value.ColorTag(colorTag.String),
				Completed:   completed.Bool,
				Motivation:  motivation.String,
				WhatToDo:    whatToDo.String,
				JobAxis:     jobAxis.String,
				Strengths:   strengths.String,
			}
			if scheduledAt.Valid {
				t := scheduledAt.Time
				app.ScheduledAt = &t
			}
			if appCreatedAt.Valid {
				app.CreatedAt = appCreatedAt.Time
			}
			if appUpdatedAt.Valid {
				app.UpdatedAt = appUpdatedAt.Time
			}
		}

		results = append(results, &repo.CompanyWithApplication{
			Company:     &c,
			Application: app,
		})
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate companies: %w", err)
	}

	return results, nil
}

func (r *companyRepository) Create(ctx context.Context, company *entity.Company) error {
	query := `
		INSERT INTO companies (id, name, recruitment_url, industry, location, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	_, err := r.db.ExecContext(ctx, query,
		company.ID,
		company.Name,
		company.RecruitmentURL,
		company.Industry,
		company.Location,
		company.CreatedAt,
		company.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("insert company: %w", err)
	}

	return nil
}
