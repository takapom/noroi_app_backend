package repository

import (
	"context"
	"noroi/internal/domain/entity"

	"github.com/google/uuid"
)

// PostWithUser represents a post with user information for timeline display
type PostWithUser struct {
	Post     *entity.Post
	User     *entity.User
	IsLiked  bool // whether the current authenticated user has cursed this post
}

type PostRepository interface {
	// Create creates a new post
	Create(ctx context.Context, post *entity.Post) error

	// FindByID finds a post by ID
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Post, error)

	// FindTimeline retrieves posts for timeline with pagination
	// offset: starting position, limit: number of posts to retrieve
	// currentUserID: ID of the authenticated user to check if they've cursed each post
	FindTimeline(ctx context.Context, offset, limit int, currentUserID uuid.UUID) ([]*PostWithUser, error)

	// FindByUserID retrieves all posts by a specific user
	FindByUserID(ctx context.Context, userID uuid.UUID, offset, limit int) ([]*entity.Post, error)

	// Update updates an existing post
	Update(ctx context.Context, post *entity.Post) error

	// Delete soft deletes a post
	Delete(ctx context.Context, id uuid.UUID) error

	// IncrementCurseCount increments the curse count of a post
	IncrementCurseCount(ctx context.Context, postID uuid.UUID) error

	// DecrementCurseCount decrements the curse count of a post
	DecrementCurseCount(ctx context.Context, postID uuid.UUID) error
}
