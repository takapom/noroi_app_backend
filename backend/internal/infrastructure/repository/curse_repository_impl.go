package repository

import (
	"context"
	"database/sql"
	"fmt"
	"noroi/internal/domain/entity"
	"noroi/internal/repository"

	"github.com/google/uuid"
)

type curseRepository struct {
	db *sql.DB
}

func NewCurseRepository(db *sql.DB) repository.CurseRepository {
	return &curseRepository{db: db}
}

func (r *curseRepository) Create(ctx context.Context, curse *entity.Curse) error {
	query := `
		INSERT INTO curses (id, user_id, post_id, ritual_id, created_at)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.db.ExecContext(
		ctx, query,
		curse.ID, curse.UserID, curse.PostID, curse.RitualID, curse.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to create curse: %w", err)
	}
	return nil
}

func (r *curseRepository) Delete(ctx context.Context, userID, postID uuid.UUID) error {
	query := `DELETE FROM curses WHERE user_id = $1 AND post_id = $2`
	result, err := r.db.ExecContext(ctx, query, userID, postID)
	if err != nil {
		return fmt.Errorf("failed to delete curse: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("curse not found")
	}

	return nil
}

func (r *curseRepository) Exists(ctx context.Context, userID, postID uuid.UUID) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM curses WHERE user_id = $1 AND post_id = $2)`
	var exists bool
	err := r.db.QueryRowContext(ctx, query, userID, postID).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to check if curse exists: %w", err)
	}
	return exists, nil
}

func (r *curseRepository) FindByPostID(ctx context.Context, postID uuid.UUID) ([]*entity.Curse, error) {
	query := `
		SELECT id, user_id, post_id, ritual_id, created_at
		FROM curses
		WHERE post_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.QueryContext(ctx, query, postID)
	if err != nil {
		return nil, fmt.Errorf("failed to find curses by post ID: %w", err)
	}
	defer rows.Close()

	var curses []*entity.Curse
	for rows.Next() {
		var curse entity.Curse
		var ritualID sql.NullString

		err := rows.Scan(
			&curse.ID, &curse.UserID, &curse.PostID, &ritualID, &curse.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan curse: %w", err)
		}

		if ritualID.Valid {
			rid, err := uuid.Parse(ritualID.String)
			if err == nil {
				curse.RitualID = &rid
			}
		}

		curses = append(curses, &curse)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %w", err)
	}

	return curses, nil
}

func (r *curseRepository) CountByPostID(ctx context.Context, postID uuid.UUID) (int, error) {
	query := `SELECT COUNT(*) FROM curses WHERE post_id = $1`
	var count int
	err := r.db.QueryRowContext(ctx, query, postID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to count curses: %w", err)
	}
	return count, nil
}
