package usecase

import (
	"context"
	"fmt"
	"noroi/internal/domain/entity"
	"noroi/internal/domain/value"
	"noroi/internal/repository"
	"sync"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"
)

type PostUsecase struct {
	postRepo       repository.PostRepository
	curseRepo      repository.CurseRepository
	userRepo       repository.UserRepository
	curseStyleRepo repository.CurseStyleRepository
}

func NewPostUsecase(
	postRepo repository.PostRepository,
	curseRepo repository.CurseRepository,
	userRepo repository.UserRepository,
	curseStyleRepo repository.CurseStyleRepository,
) *PostUsecase {
	return &PostUsecase{
		postRepo:       postRepo,
		curseRepo:      curseRepo,
		userRepo:       userRepo,
		curseStyleRepo: curseStyleRepo,
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
	UserID       string `json:"user_id"`
	Username     string `json:"username"`
	Content      string `json:"content"`
	PostType     string `json:"post_type"`
	IsAnonymous  bool   `json:"is_anonymous"`
	CurseCount   int    `json:"curse_count"`
	IsCursedByMe bool   `json:"is_cursed_by_me"`
	CreatedAt    string `json:"created_at"`
	// 呪癖スタイル情報
	CurseStyleName        string `json:"curse_style_name"`
	CurseStyleNameEn      string `json:"curse_style_name_en"`
	CurseStyleDescription string `json:"curse_style_description"`
}

func (uc *PostUsecase) GetTimeline(ctx context.Context, currentUserID uuid.UUID, offset, limit int) ([]*PostResponse, error) {
	if limit <= 0 {
		limit = 20 // Default limit
	}
	if limit > 100 {
		limit = 100 // Max limit
	}

	// ========================================
	// ステップ1: 投稿とユーザー情報を取得（1回のクエリ）
	// ========================================
	postsWithUser, err := uc.postRepo.FindTimeline(ctx, offset, limit, currentUserID)
	if err != nil {
		return nil, fmt.Errorf("failed to get timeline: %w", err)
	}

	// 投稿がない場合は早期リターン
	if len(postsWithUser) == 0 {
		return []*PostResponse{}, nil
	}

	// ========================================
	// ステップ2: ユニークなcurse_style_idを抽出（メモリ操作のみ）
	// ========================================
	styleIDSet := make(map[uuid.UUID]bool)
	for _, pwu := range postsWithUser {
		styleIDSet[pwu.User.CurseStyleID] = true
	}

	// Mapのキーを配列に変換
	styleIDs := make([]uuid.UUID, 0, len(styleIDSet))
	for id := range styleIDSet {
		styleIDs = append(styleIDs, id)
	}

	// ========================================
	// ステップ3: 呪癖スタイル情報を並行取得（goroutine使用）
	// ========================================
	styleMap := make(map[uuid.UUID]*entity.CurseStyle)
	var mu sync.Mutex // styleMapへの並行アクセスを保護

	// errgroup を使ってgoroutineのエラーハンドリング
	g, gctx := errgroup.WithContext(ctx)

	// 各呪癖スタイルIDに対してgoroutineを起動
	for _, styleID := range styleIDs {
		styleID := styleID // クロージャのキャプチャ対策（重要！）

		g.Go(func() error {
			// DBから呪癖スタイル情報を取得
			style, err := uc.curseStyleRepo.FindByID(gctx, styleID)
			if err != nil {
				return fmt.Errorf("failed to fetch curse style %s: %w", styleID, err)
			}

			// Mapに保存（Mutexでロック）
			mu.Lock()
			styleMap[styleID] = style
			mu.Unlock()

			return nil
		})
	}

	// 全goroutineの完了を待つ
	if err := g.Wait(); err != nil {
		return nil, fmt.Errorf("failed to fetch curse styles: %w", err)
	}

	// ========================================
	// ステップ4: レスポンスを構築（呪癖スタイル情報を含める）
	// ========================================
	responses := make([]*PostResponse, 0, len(postsWithUser))
	for _, pwu := range postsWithUser {
		username := pwu.User.Username
		if pwu.Post.IsAnonymous {
			username = "匿名"
		}

		// 呪癖スタイル情報を取得
		style := styleMap[pwu.User.CurseStyleID]

		responses = append(responses, &PostResponse{
			ID:           pwu.Post.ID.String(),
			UserID:       pwu.Post.UserID.String(),
			Username:     username,
			Content:      pwu.Post.Content.String(),
			PostType:     string(pwu.Post.PostType),
			IsAnonymous:  pwu.Post.IsAnonymous,
			CurseCount:   pwu.Post.CurseCount,
			IsCursedByMe: pwu.IsLiked,
			CreatedAt:    pwu.Post.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
			// 呪癖スタイル情報を追加
			CurseStyleName:        style.Name,
			CurseStyleNameEn:      style.NameEn,
			CurseStyleDescription: style.Description,
		})
	}

	return responses, nil
}

func (uc *PostUsecase) CreatePost(ctx context.Context, userID uuid.UUID, input CreatePostInput) (*PostResponse, error) {
	// Fetch user to get username
	user, err := uc.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	// Validate content
	content, err := value.NewPostContent(input.Content)
	if err != nil {
		return nil, err
	}

	// Create post entity with username
	post, err := entity.NewPost(userID, user.Username, content, entity.PostTypeNormal, input.IsAnonymous)
	if err != nil {
		return nil, fmt.Errorf("failed to create post entity: %w", err)
	}

	// Save to database
	if err := uc.postRepo.Create(ctx, post); err != nil {
		return nil, fmt.Errorf("failed to save post: %w", err)
	}

	// Display username based on anonymity setting
	displayUsername := user.Username
	if input.IsAnonymous {
		displayUsername = "匿名"
	}

	return &PostResponse{
		ID:           post.ID.String(),
		UserID:       post.UserID.String(),
		Username:     displayUsername,
		Content:      post.Content.String(),
		PostType:     string(post.PostType),
		IsAnonymous:  post.IsAnonymous,
		CurseCount:   0,
		IsCursedByMe: false,
		CreatedAt:    post.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
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
