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
}

func NewUserUsecase(
	userRepo repository.UserRepository,
	curseStyleRepo repository.CurseStyleRepository,
) *UserUsecase {
	return &UserUsecase{
		userRepo:       userRepo,
		curseStyleRepo: curseStyleRepo,
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
	IsSpecial   bool   `json:"is_special"`
	PointCost   int    `json:"point_cost"`
}

func (uc *UserUsecase) GetProfile(ctx context.Context, userID uuid.UUID) (*UserResponse, error) {
	user, err := uc.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
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
