package usecase

import (
	"context"
	"fmt"
	"noroi/internal/domain/entity"
	"noroi/internal/repository"

	"github.com/google/uuid"
)

type UserUsecase struct {
	userRepo       repository.UserRepository
	curseStyleRepo repository.CurseStyleRepository
	postRepo       repository.PostRepository
}

func NewUserUsecase(
	userRepo repository.UserRepository,
	curseStyleRepo repository.CurseStyleRepository,
	postRepo repository.PostRepository,
) *UserUsecase {
	return &UserUsecase{
		userRepo:       userRepo,
		curseStyleRepo: curseStyleRepo,
		postRepo:       postRepo,
	}
}

type UpdateProfileInput struct {
	Username     string `json:"username"`
	Age          int    `json:"age"`
	Gender       string `json:"gender"`
	CurseStyleID string `json:"curse_style_id"`
}

type CurseStyleResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	NameEn      string `json:"name_en"`
	Description string `json:"description"`
	IsSpecial   bool   `json:"is_special,omitempty"`
	PointCost   int    `json:"point_cost,omitempty"`
}

type UserStatsResponse struct {
	Posts  int `json:"posts"`
	Curses int `json:"curses"`
	Days   int `json:"days"`
}

type UserPostResponse struct {
	ID         string `json:"id"`
	Content    string `json:"content"`
	CurseCount int    `json:"curse_count"`
	CreatedAt  string `json:"created_at"`
}

type UserProfileResponse struct {
	ID         string              `json:"id"`
	Email      string              `json:"email"`
	Username   string              `json:"username"`
	Age        int                 `json:"age"`
	Gender     string              `json:"gender"`
	CurseStyle *CurseStyleResponse `json:"curse_style"`
	Points     int                 `json:"points"`
	Stats      *UserStatsResponse  `json:"stats"`
	CreatedAt  string              `json:"created_at"`
}

func (uc *UserUsecase) GetProfile(ctx context.Context, userID uuid.UUID) (*UserProfileResponse, error) {
	user, err := uc.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}

	// Get curse style information
	curseStyle, err := uc.curseStyleRepo.FindByID(ctx, user.CurseStyleID)
	if err != nil {
		return nil, fmt.Errorf("failed to get curse style: %w", err)
	}

	// Get user statistics
	posts, curses, days, err := uc.userRepo.GetUserStats(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user stats: %w", err)
	}

	return &UserProfileResponse{
		ID:       user.ID.String(),
		Email:    user.Email.String(),
		Username: user.Username,
		Age:      user.Age,
		Gender:   string(user.Gender),
		CurseStyle: &CurseStyleResponse{
			ID:          curseStyle.ID.String(),
			Name:        curseStyle.Name,
			NameEn:      curseStyle.NameEn,
			Description: curseStyle.Description,
		},
		Points: user.Points,
		Stats: &UserStatsResponse{
			Posts:  posts,
			Curses: curses,
			Days:   days,
		},
		CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}, nil
}

func (uc *UserUsecase) UpdateProfile(ctx context.Context, userID uuid.UUID, input UpdateProfileInput) (*UserResponse, error) {
	// Find user
	user, err := uc.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	// Validate gender
	gender := entity.Gender(input.Gender)
	if gender != entity.GenderMale && gender != entity.GenderFemale && gender != entity.GenderUnknown {
		return nil, fmt.Errorf("invalid gender value")
	}

	// Update profile
	user.UpdateProfile(input.Username, input.Age, gender)

	// Update curse style if provided
	if input.CurseStyleID != "" {
		curseStyleID, err := uuid.Parse(input.CurseStyleID)
		if err != nil {
			return nil, fmt.Errorf("invalid curse style ID: %w", err)
		}

		// Verify curse style exists
		_, err = uc.curseStyleRepo.FindByID(ctx, curseStyleID)
		if err != nil {
			return nil, fmt.Errorf("invalid curse style: %w", err)
		}

		user.ChangeCurseStyle(curseStyleID)
	}

	// Save to database
	if err := uc.userRepo.Update(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return &UserResponse{
		ID:           user.ID.String(),
		Email:        user.Email.String(),
		Username:     user.Username,
		Age:          user.Age,
		Gender:       string(user.Gender),
		CurseStyleID: user.CurseStyleID.String(),
		Points:       user.Points,
	}, nil
}

func (uc *UserUsecase) GetCurseStyles(ctx context.Context) ([]*CurseStyleResponse, error) {
	styles, err := uc.curseStyleRepo.FindAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get curse styles: %w", err)
	}

	responses := make([]*CurseStyleResponse, 0, len(styles))
	for _, style := range styles {
		responses = append(responses, &CurseStyleResponse{
			ID:          style.ID.String(),
			Name:        style.Name,
			NameEn:      style.NameEn,
			Description: style.Description,
			IsSpecial:   style.IsSpecial,
			PointCost:   style.PointCost,
		})
	}

	return responses, nil
}

func (uc *UserUsecase) GetMyPosts(ctx context.Context, userID uuid.UUID) ([]*UserPostResponse, error) {
	// Retrieve user's posts (offset 0, limit 100 for now - can be made configurable)
	posts, err := uc.postRepo.FindByUserID(ctx, userID, 0, 100)
	if err != nil {
		return nil, fmt.Errorf("failed to get user posts: %w", err)
	}

	responses := make([]*UserPostResponse, 0, len(posts))
	for _, post := range posts {
		responses = append(responses, &UserPostResponse{
			ID:         post.ID.String(),
			Content:    post.Content.String(),
			CurseCount: post.CurseCount,
			CreatedAt:  post.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}

	return responses, nil
}
