package repository

import (
	"context"
	"database/sql"
	"fmt"
	"noroi/internal/domain/entity"
	"noroi/internal/repository"
	"noroi/pkg/errors"
	"strings"

	"github.com/google/uuid"
)

type curseStyleRepository struct {
	db *sql.DB
}

func NewCurseStyleRepository(db *sql.DB) repository.CurseStyleRepository {
	return &curseStyleRepository{db: db}
}

func (r *curseStyleRepository) FindAll(ctx context.Context) ([]*entity.CurseStyle, error) {
	query := `
		SELECT id, name, name_en, description, is_special, point_cost, created_at
		FROM curse_styles
		ORDER BY is_special ASC, created_at ASC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to find all curse styles: %w", err)
	}
	defer rows.Close()

	var styles []*entity.CurseStyle
	for rows.Next() {
		var style entity.CurseStyle
		err := rows.Scan(
			&style.ID, &style.Name, &style.NameEn, &style.Description,
			&style.IsSpecial, &style.PointCost, &style.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan curse style: %w", err)
		}
		styles = append(styles, &style)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %w", err)
	}

	return styles, nil
}

func (r *curseStyleRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.CurseStyle, error) {
	query := `
		SELECT id, name, name_en, description, is_special, point_cost, created_at
		FROM curse_styles
		WHERE id = $1
	`
	var style entity.CurseStyle
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&style.ID, &style.Name, &style.NameEn, &style.Description,
		&style.IsSpecial, &style.PointCost, &style.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, errors.ErrCurseStyleNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find curse style by ID: %w", err)
	}

	return &style, nil
}

func (r *curseStyleRepository) FindByNameEn(ctx context.Context, nameEn string) (*entity.CurseStyle, error) {
	// Convert to lowercase and handle partial matches
	// Frontend sends: "infernal", "frozen", "shadow", "blood", "danse"
	// DB has: "Infernal Rite", "Frozen Curse", etc.
	// We'll search case-insensitively by checking if the lowercase name_en starts with the input
	query := `
		SELECT id, name, name_en, description, is_special, point_cost, created_at
		FROM curse_styles
		WHERE LOWER(name_en) LIKE LOWER($1) || '%'
		LIMIT 1
	`
	var style entity.CurseStyle
	err := r.db.QueryRowContext(ctx, query, strings.ToLower(nameEn)).Scan(
		&style.ID, &style.Name, &style.NameEn, &style.Description,
		&style.IsSpecial, &style.PointCost, &style.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, errors.ErrCurseStyleNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find curse style by name_en: %w", err)
	}

	return &style, nil
}

func (r *curseStyleRepository) FindBasicStyles(ctx context.Context) ([]*entity.CurseStyle, error) {
	query := `
		SELECT id, name, name_en, description, is_special, point_cost, created_at
		FROM curse_styles
		WHERE is_special = FALSE
		ORDER BY created_at ASC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to find basic curse styles: %w", err)
	}
	defer rows.Close()

	var styles []*entity.CurseStyle
	for rows.Next() {
		var style entity.CurseStyle
		err := rows.Scan(
			&style.ID, &style.Name, &style.NameEn, &style.Description,
			&style.IsSpecial, &style.PointCost, &style.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan curse style: %w", err)
		}
		styles = append(styles, &style)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %w", err)
	}

	return styles, nil
}
