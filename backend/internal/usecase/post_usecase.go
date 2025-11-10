package usecase

import (
	"context"
	"fmt"
	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"
	"noroi/internal/repository"
	"time"

	"github.com/google/uuid"
)

type PostUsecase struct {
	postRepo  repository.PostRepository
	curseRepo repository.CurseRepository
}

func NewPostUsecase(
	postRepo repository.PostRepository,
	curseRepo repository.CurseRepository,
) *PostUsecase {
	return &PostUsecase{
		postRepo:  postRepo,
		curseRepo: curseRepo,
	}
}

type CreatePostInput struct {
	Content     string `json:"content"`
	IsAnonymous bool   `json:"is_anonymous"`
}

type UpdatePostInput struct {
	Content string `json:"content"`
}

type PostResponse struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Avatar       string `json:"avatar"` // For future use
	Timestamp    string `json:"timestamp"`
	Content      string `json:"content"`
	LikeCount    int    `json:"likeCount"`
	CommentCount int    `json:"commentCount"` // Always 0 for now
	IsLiked      bool   `json:"isLiked"`
}

func (uc *PostUsecase) GetTimeline(ctx context.Context, currentUserID uuid.UUID, offset, limit int) ([]*PostResponse, error) {
	if limit <= 0 {
		limit = 20 // Default limit
	}
	if limit > 100 {
		limit = 100 // Max limit
	}

	postsWithUser, err := uc.postRepo.FindTimeline(ctx, offset, limit, currentUserID)
	if err != nil {
		return nil, fmt.Errorf("failed to get timeline: %w", err)
	}

	responses := make([]*PostResponse, 0, len(postsWithUser))
	for _, pwu := range postsWithUser {
		username := pwu.User.Username
		if pwu.Post.IsAnonymous {
			username = "匿名"
		}

		responses = append(responses, &PostResponse{
			ID:           pwu.Post.ID.String(),
			Username:     username,
			Avatar:       "", // For future implementation
			Timestamp:    formatRelativeTime(pwu.Post.CreatedAt),
			Content:      pwu.Post.Content.String(),
			LikeCount:    pwu.Post.CurseCount,
			CommentCount: 0,
			IsLiked:      pwu.IsLiked,
		})
	}

	return responses, nil
}

func (uc *PostUsecase) CreatePost(ctx context.Context, userID uuid.UUID, input CreatePostInput) (*PostResponse, error) {
	// Validate content
	content, err := value.NewPostContent(input.Content)
	if err != nil {
		return nil, err
	}

	// Create post entity
	post, err := entity.NewPost(userID, content, entity.PostTypeNormal, input.IsAnonymous)
	if err != nil {
		return nil, fmt.Errorf("failed to create post entity: %w", err)
	}

	// Save to database
	if err := uc.postRepo.Create(ctx, post); err != nil {
		return nil, fmt.Errorf("failed to save post: %w", err)
	}

	username := "匿名"
	if !input.IsAnonymous {
		// In a real implementation, we would fetch the user's username
		// For now, we'll just return the post without the username
		username = "" // This should be fetched from user repository
	}

	return &PostResponse{
		ID:           post.ID.String(),
		Username:     username,
		Avatar:       "",
		Timestamp:    formatRelativeTime(post.CreatedAt),
		Content:      post.Content.String(),
		LikeCount:    0,
		CommentCount: 0,
		IsLiked:      false,
	}, nil
}

func (uc *PostUsecase) UpdatePost(ctx context.Context, postID, userID uuid.UUID, input UpdatePostInput) error {
	// Find the post
	post, err := uc.postRepo.FindByID(ctx, postID)
	if err != nil {
		return err
	}

	// Validate content
	content, err := value.NewPostContent(input.Content)
	if err != nil {
		return err
	}

	// Update the post (entity method checks ownership)
	if err := post.UpdateContent(content, userID); err != nil {
		return err
	}

	// Save to database
	if err := uc.postRepo.Update(ctx, post); err != nil {
		return fmt.Errorf("failed to update post: %w", err)
	}

	return nil
}

func (uc *PostUsecase) DeletePost(ctx context.Context, postID, userID uuid.UUID) error {
	// Find the post
	post, err := uc.postRepo.FindByID(ctx, postID)
	if err != nil {
		return err
	}

	// Delete the post (entity method checks ownership)
	if err := post.Delete(userID); err != nil {
		return err
	}

	// Save to database (soft delete)
	if err := uc.postRepo.Update(ctx, post); err != nil {
		return fmt.Errorf("failed to delete post: %w", err)
	}

	return nil
}

// formatRelativeTime converts a timestamp to relative time (e.g., "2時間前")
func formatRelativeTime(t time.Time) string {
	now := time.Now()
	diff := now.Sub(t)

	if diff < time.Minute {
		return "たった今"
	} else if diff < time.Hour {
		minutes := int(diff.Minutes())
		return fmt.Sprintf("%d分前", minutes)
	} else if diff < 24*time.Hour {
		hours := int(diff.Hours())
		return fmt.Sprintf("%d時間前", hours)
	} else if diff < 7*24*time.Hour {
		days := int(diff.Hours() / 24)
		return fmt.Sprintf("%d日前", days)
	} else if diff < 30*24*time.Hour {
		weeks := int(diff.Hours() / 24 / 7)
		return fmt.Sprintf("%d週間前", weeks)
	} else if diff < 365*24*time.Hour {
		months := int(diff.Hours() / 24 / 30)
		return fmt.Sprintf("%dヶ月前", months)
	}
	years := int(diff.Hours() / 24 / 365)
	return fmt.Sprintf("%d年前", years)
}
