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

type postRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) repository.PostRepository {
	return &postRepository{db: db}
}

func (r *postRepository) Create(ctx context.Context, post *entity.Post) error {
	query := `
		INSERT INTO posts (
			id, user_id, username, content, post_type, is_anonymous,
			ritual_id, curse_count, is_deleted, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`
	_, err := r.db.ExecContext(
		ctx, query,
		post.ID, post.UserID, post.Username, post.Content.String(), post.PostType,
		post.IsAnonymous, post.RitualID, post.CurseCount,
		post.IsDeleted, post.CreatedAt, post.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to create post: %w", err)
	}
	return nil
}

func (r *postRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Post, error) {
	query := `
		SELECT
			id, user_id, username, content, post_type, is_anonymous,
			ritual_id, curse_count, is_deleted, created_at, updated_at, deleted_at
		FROM posts
		WHERE id = $1
	`
	var post entity.Post
	var content string
	var ritualID sql.NullString
	var deletedAt sql.NullTime

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&post.ID, &post.UserID, &post.Username, &content, &post.PostType,
		&post.IsAnonymous, &ritualID, &post.CurseCount,
		&post.IsDeleted, &post.CreatedAt, &post.UpdatedAt, &deletedAt,
	)
	if err == sql.ErrNoRows {
		return nil, errors.ErrPostNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find post by ID: %w", err)
	}

	postContent, err := value.NewPostContent(content)
	if err != nil {
		return nil, fmt.Errorf("invalid post content: %w", err)
	}
	post.Content = postContent

	if ritualID.Valid {
		rid, err := uuid.Parse(ritualID.String)
		if err == nil {
			post.RitualID = &rid
		}
	}

	if deletedAt.Valid {
		post.DeletedAt = &deletedAt.Time
	}

	return &post, nil
}

func (r *postRepository) FindTimeline(ctx context.Context, offset, limit int, currentUserID uuid.UUID) ([]*repository.PostWithUser, error) {
	query := `
		SELECT
			p.id, p.user_id, p.username, p.content, p.post_type, p.is_anonymous,
			p.ritual_id, p.curse_count, p.is_deleted, p.created_at, p.updated_at, p.deleted_at,
			u.id, u.email, u.password_hash, u.username, u.age, u.gender,
			u.curse_style_id, u.points, u.profile_public, u.notify_curse,
			u.notify_ritual, u.is_deleted, u.created_at, u.updated_at, u.deleted_at,
			COALESCE((SELECT TRUE FROM curses WHERE user_id = $1 AND post_id = p.id), FALSE) as is_liked
		FROM posts p
		JOIN users u ON p.user_id = u.id
		WHERE p.post_type = 'normal' AND p.is_deleted = FALSE
		ORDER BY p.created_at DESC
		LIMIT $2 OFFSET $3
	`
	rows, err := r.db.QueryContext(ctx, query, currentUserID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to find timeline: %w", err)
	}
	defer rows.Close()

	var results []*repository.PostWithUser
	for rows.Next() {
		var post entity.Post
		var user entity.User
		var content, email, passwordHash string
		var postRitualID, postDeletedAt, userDeletedAt sql.NullString
		var isLiked bool

		err := rows.Scan(
			&post.ID, &post.UserID, &post.Username, &content, &post.PostType, &post.IsAnonymous,
			&postRitualID, &post.CurseCount, &post.IsDeleted, &post.CreatedAt, &post.UpdatedAt, &postDeletedAt,
			&user.ID, &email, &passwordHash, &user.Username, &user.Age, &user.Gender,
			&user.CurseStyleID, &user.Points, &user.ProfilePublic, &user.NotifyCurse,
			&user.NotifyRitual, &user.IsDeleted, &user.CreatedAt, &user.UpdatedAt, &userDeletedAt,
			&isLiked,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan post: %w", err)
		}

		postContent, err := value.NewPostContent(content)
		if err != nil {
			return nil, fmt.Errorf("invalid post content: %w", err)
		}
		post.Content = postContent

		emailVal, _ := value.NewEmail(email)
		user.Email = emailVal
		user.Password = value.NewPasswordFromHash(passwordHash)

		if postRitualID.Valid {
			rid, err := uuid.Parse(postRitualID.String)
			if err == nil {
				post.RitualID = &rid
			}
		}

		results = append(results, &repository.PostWithUser{
			Post:    &post,
			User:    &user,
			IsLiked: isLiked,
		})
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %w", err)
	}

	return results, nil
}

func (r *postRepository) FindByUserID(ctx context.Context, userID uuid.UUID, offset, limit int) ([]*entity.Post, error) {
	query := `
		SELECT
			id, user_id, username, content, post_type, is_anonymous,
			ritual_id, curse_count, is_deleted, created_at, updated_at, deleted_at
		FROM posts
		WHERE user_id = $1 AND is_deleted = FALSE
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`
	rows, err := r.db.QueryContext(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to find posts by user ID: %w", err)
	}
	defer rows.Close()

	var posts []*entity.Post
	for rows.Next() {
		var post entity.Post
		var content string
		var ritualID sql.NullString
		var deletedAt sql.NullTime

		err := rows.Scan(
			&post.ID, &post.UserID, &post.Username, &content, &post.PostType,
			&post.IsAnonymous, &ritualID, &post.CurseCount,
			&post.IsDeleted, &post.CreatedAt, &post.UpdatedAt, &deletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan post: %w", err)
		}

		postContent, err := value.NewPostContent(content)
		if err != nil {
			return nil, fmt.Errorf("invalid post content: %w", err)
		}
		post.Content = postContent

		if ritualID.Valid {
			rid, err := uuid.Parse(ritualID.String)
			if err == nil {
				post.RitualID = &rid
			}
		}

		if deletedAt.Valid {
			post.DeletedAt = &deletedAt.Time
		}

		posts = append(posts, &post)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %w", err)
	}

	return posts, nil
}

func (r *postRepository) Update(ctx context.Context, post *entity.Post) error {
	query := `
		UPDATE posts
		SET content = $1, post_type = $2, is_anonymous = $3,
			ritual_id = $4, curse_count = $5, is_deleted = $6,
			updated_at = $7, deleted_at = $8
		WHERE id = $9
	`
	_, err := r.db.ExecContext(
		ctx, query,
		post.Content.String(), post.PostType, post.IsAnonymous,
		post.RitualID, post.CurseCount, post.IsDeleted,
		post.UpdatedAt, post.DeletedAt, post.ID,
	)
	if err != nil {
		return fmt.Errorf("failed to update post: %w", err)
	}
	return nil
}

func (r *postRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `
		UPDATE posts
		SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete post: %w", err)
	}
	return nil
}

func (r *postRepository) IncrementCurseCount(ctx context.Context, postID uuid.UUID) error {
	query := `
		UPDATE posts
		SET curse_count = curse_count + 1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, query, postID)
	if err != nil {
		return fmt.Errorf("failed to increment curse count: %w", err)
	}
	return nil
}

func (r *postRepository) DecrementCurseCount(ctx context.Context, postID uuid.UUID) error {
	query := `
		UPDATE posts
		SET curse_count = GREATEST(curse_count - 1, 0), updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, query, postID)
	if err != nil {
		return fmt.Errorf("failed to decrement curse count: %w", err)
	}
	return nil
}
