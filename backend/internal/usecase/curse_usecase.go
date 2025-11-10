package usecase

import (
	"context"
	"fmt"
	"noroi/internal/domain/entity"
	"noroi/internal/repository"
	"noroi/pkg/errors"

	"github.com/google/uuid"
)

type CurseUsecase struct {
	postRepo  repository.PostRepository
	curseRepo repository.CurseRepository
}

func NewCurseUsecase(
	postRepo repository.PostRepository,
	curseRepo repository.CurseRepository,
) *CurseUsecase {
	return &CurseUsecase{
		postRepo:  postRepo,
		curseRepo: curseRepo,
	}
}

func (uc *CurseUsecase) CursePost(ctx context.Context, userID, postID uuid.UUID) error {
	// Check if already cursed
	exists, err := uc.curseRepo.Exists(ctx, userID, postID)
	if err != nil {
		return fmt.Errorf("failed to check curse existence: %w", err)
	}
	if exists {
		return errors.ErrAlreadyCursed
	}

	// Find the post
	post, err := uc.postRepo.FindByID(ctx, postID)
	if err != nil {
		return err
	}

	// Create curse entity (validates that user is not cursing their own post)
	curse, err := entity.NewCurse(userID, postID, post)
	if err != nil {
		return err
	}

	// Save curse
	if err := uc.curseRepo.Create(ctx, curse); err != nil {
		return fmt.Errorf("failed to create curse: %w", err)
	}

	// Increment curse count on post
	if err := uc.postRepo.IncrementCurseCount(ctx, postID); err != nil {
		return fmt.Errorf("failed to increment curse count: %w", err)
	}

	return nil
}

func (uc *CurseUsecase) UncursePost(ctx context.Context, userID, postID uuid.UUID) error {
	// Check if curse exists
	exists, err := uc.curseRepo.Exists(ctx, userID, postID)
	if err != nil {
		return fmt.Errorf("failed to check curse existence: %w", err)
	}
	if !exists {
		return errors.ErrCurseNotFound
	}

	// Delete curse
	if err := uc.curseRepo.Delete(ctx, userID, postID); err != nil {
		return fmt.Errorf("failed to delete curse: %w", err)
	}

	// Decrement curse count on post
	if err := uc.postRepo.DecrementCurseCount(ctx, postID); err != nil {
		return fmt.Errorf("failed to decrement curse count: %w", err)
	}

	return nil
}
