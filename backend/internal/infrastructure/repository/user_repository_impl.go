package repository

import (
	"context"
	"database/sql"
	"fmt"
	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"
	"noroi/internal/repository"
	"noroi/pkg/errors"

	"github.com/google/uuid"
)

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) repository.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *entity.User) error {
	query := `
		INSERT INTO users (
			id, email, password_hash, username, age, gender,
			curse_style_id, points, profile_public, notify_curse,
			notify_ritual, is_deleted, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
	`
	_, err := r.db.ExecContext(
		ctx, query,
		user.ID, user.Email.String(), user.Password.Hash(), user.Username,
		user.Age, user.Gender, user.CurseStyleID, user.Points,
		user.ProfilePublic, user.NotifyCurse, user.NotifyRitual,
		user.IsDeleted, user.CreatedAt, user.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

func (r *userRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.User, error) {
	query := `
		SELECT
			id, email, password_hash, username, age, gender,
			curse_style_id, points, profile_public, notify_curse,
			notify_ritual, is_deleted, created_at, updated_at, deleted_at
		FROM users
		WHERE id = $1 AND is_deleted = FALSE
	`
	var user entity.User
	var email, passwordHash string
	var deletedAt sql.NullTime

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID, &email, &passwordHash, &user.Username,
		&user.Age, &user.Gender, &user.CurseStyleID, &user.Points,
		&user.ProfilePublic, &user.NotifyCurse, &user.NotifyRitual,
		&user.IsDeleted, &user.CreatedAt, &user.UpdatedAt, &deletedAt,
	)
	if err == sql.ErrNoRows {
		return nil, errors.ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user by ID: %w", err)
	}

	emailVal, _ := value.NewEmail(email)
	user.Email = emailVal
	user.Password = value.NewPasswordFromHash(passwordHash)
	if deletedAt.Valid {
		user.DeletedAt = &deletedAt.Time
	}

	return &user, nil
}

func (r *userRepository) FindByEmail(ctx context.Context, email value.Email) (*entity.User, error) {
	query := `
		SELECT
			id, email, password_hash, username, age, gender,
			curse_style_id, points, profile_public, notify_curse,
			notify_ritual, is_deleted, created_at, updated_at, deleted_at
		FROM users
		WHERE email = $1 AND is_deleted = FALSE
	`
	var user entity.User
	var emailStr, passwordHash string
	var deletedAt sql.NullTime

	err := r.db.QueryRowContext(ctx, query, email.String()).Scan(
		&user.ID, &emailStr, &passwordHash, &user.Username,
		&user.Age, &user.Gender, &user.CurseStyleID, &user.Points,
		&user.ProfilePublic, &user.NotifyCurse, &user.NotifyRitual,
		&user.IsDeleted, &user.CreatedAt, &user.UpdatedAt, &deletedAt,
	)
	if err == sql.ErrNoRows {
		return nil, errors.ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user by email: %w", err)
	}

	emailVal, _ := value.NewEmail(emailStr)
	user.Email = emailVal
	user.Password = value.NewPasswordFromHash(passwordHash)
	if deletedAt.Valid {
		user.DeletedAt = &deletedAt.Time
	}

	return &user, nil
}

func (r *userRepository) Update(ctx context.Context, user *entity.User) error {
	query := `
		UPDATE users
		SET username = $1, age = $2, gender = $3, curse_style_id = $4,
			points = $5, profile_public = $6, notify_curse = $7,
			notify_ritual = $8, is_deleted = $9, updated_at = $10,
			deleted_at = $11
		WHERE id = $12
	`
	_, err := r.db.ExecContext(
		ctx, query,
		user.Username, user.Age, user.Gender, user.CurseStyleID,
		user.Points, user.ProfilePublic, user.NotifyCurse,
		user.NotifyRitual, user.IsDeleted, user.UpdatedAt,
		user.DeletedAt, user.ID,
	)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}
	return nil
}

func (r *userRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `
		UPDATE users
		SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}
	return nil
}

func (r *userRepository) ExistsByEmail(ctx context.Context, email value.Email) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND is_deleted = FALSE)`
	var exists bool
	err := r.db.QueryRowContext(ctx, query, email.String()).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to check if user exists: %w", err)
	}
	return exists, nil
}
