package usecase

import (
	"context"
	"fmt"
	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"
	"noroi/internal/repository"
	"noroi/pkg/errors"
	"noroi/pkg/jwt"
	"strconv"
)

type AuthUsecase struct {
	userRepo        repository.UserRepository
	curseStyleRepo  repository.CurseStyleRepository
	jwtManager      *jwt.Manager
}

func NewAuthUsecase(
	userRepo repository.UserRepository,
	curseStyleRepo repository.CurseStyleRepository,
	jwtManager *jwt.Manager,
) *AuthUsecase {
	return &AuthUsecase{
		userRepo:       userRepo,
		curseStyleRepo: curseStyleRepo,
		jwtManager:     jwtManager,
	}
}

type RegisterInput struct {
	Email      string `json:"email"`
	Username   string `json:"username"`
	Password   string `json:"password"`
	Age        string `json:"age"` // Frontend sends as string
	Gender     string `json:"gender"`
	CurseStyle string `json:"curseStyle"` // e.g., "infernal", "frozen", etc.
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	User         *UserResponse `json:"user"`
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
}

type UserResponse struct {
	ID           string `json:"id"`
	Email        string `json:"email"`
	Username     string `json:"username"`
	Age          int    `json:"age"`
	Gender       string `json:"gender"`
	CurseStyleID string `json:"curse_style_id"`
	Points       int    `json:"points"`
}

func (uc *AuthUsecase) Register(ctx context.Context, input RegisterInput) (*AuthResponse, error) {
	// Validate email first
	email, err := value.NewEmail(input.Email)
	if err != nil {
		return nil, err
	}

	// Check if email already exists
	exists, err := uc.userRepo.ExistsByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("failed to check email existence: %w", err)
	}
	if exists {
		return nil, errors.ErrEmailAlreadyExists
	}

	// Parse age from string to int
	age, err := strconv.Atoi(input.Age)
	if err != nil {
		return nil, fmt.Errorf("invalid age format: %w", err)
	}

	// Validate and hash password (NewPassword already hashes it)
	password, err := value.NewPassword(input.Password)
	if err != nil {
		return nil, err
	}

	// Find curse style by English name
	curseStyle, err := uc.curseStyleRepo.FindByNameEn(ctx, input.CurseStyle)
	if err != nil {
		return nil, fmt.Errorf("invalid curse style: %w", err)
	}

	// Validate gender
	gender := entity.Gender(input.Gender)
	if gender != entity.GenderMale && gender != entity.GenderFemale && gender != entity.GenderUnknown {
		return nil, fmt.Errorf("invalid gender value")
	}

	// Create user entity
	user := entity.NewUser(
		email,
		password,
		input.Username,
		age,
		gender,
		curseStyle.ID,
	)

	// Save user to database
	if err := uc.userRepo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Generate JWT tokens
	tokens, err := uc.jwtManager.GenerateTokenPair(user.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return &AuthResponse{
		User: &UserResponse{
			ID:           user.ID.String(),
			Email:        user.Email.String(),
			Username:     user.Username,
			Age:          user.Age,
			Gender:       string(user.Gender),
			CurseStyleID: user.CurseStyleID.String(),
			Points:       user.Points,
		},
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

func (uc *AuthUsecase) Login(ctx context.Context, input LoginInput) (*AuthResponse, error) {
	// Validate email
	email, err := value.NewEmail(input.Email)
	if err != nil {
		return nil, err
	}

	// Find user by email
	user, err := uc.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if err == errors.ErrUserNotFound {
			return nil, errors.ErrInvalidCredentials
		}
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	// Verify password
	if !user.Password.Compare(input.Password) {
		return nil, errors.ErrInvalidCredentials
	}

	// Generate JWT tokens
	tokens, err := uc.jwtManager.GenerateTokenPair(user.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return &AuthResponse{
		User: &UserResponse{
			ID:           user.ID.String(),
			Email:        user.Email.String(),
			Username:     user.Username,
			Age:          user.Age,
			Gender:       string(user.Gender),
			CurseStyleID: user.CurseStyleID.String(),
			Points:       user.Points,
		},
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

func (uc *AuthUsecase) RefreshToken(ctx context.Context, refreshToken string) (string, error) {
	newAccessToken, err := uc.jwtManager.RefreshAccessToken(refreshToken)
	if err != nil {
		return "", errors.ErrInvalidToken
	}
	return newAccessToken, nil
}
