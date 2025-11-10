package entity

import (
	"time"
	"noroi/internal/domain/value"
	"noroi/pkg/errors"
	"github.com/google/uuid"
)

type PostType string

const (
	PostTypeNormal PostType = "normal"
	PostTypeRitual PostType = "ritual"
)

type Post struct {
	ID            uuid.UUID
	UserID        uuid.UUID
	Content       value.PostContent
	PostType      PostType
	IsAnonymous   bool
	RitualID      *uuid.UUID // イベント投稿の場合のみ
	CurseCount    int
	IsDeleted     bool
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     *time.Time
}

func NewPost(userID uuid.UUID, content value.PostContent, postType PostType, isAnonymous bool) (*Post, error) {
	if postType != PostTypeNormal && postType != PostTypeRitual {
		return nil, errors.ErrInvalidPostType
	}
	
	now := time.Now()
	return &Post{
		ID:          uuid.New(),
		UserID:      userID,
		Content:     content,
		PostType:    postType,
		IsAnonymous: isAnonymous,
		CurseCount:  0,
		IsDeleted:   false,
		CreatedAt:   now,
		UpdatedAt:   now,
	}, nil
}

func (p *Post) SetRitualID(ritualID uuid.UUID) {
	p.RitualID = &ritualID
	p.UpdatedAt = time.Now()
}

func (p *Post) UpdateContent(content value.PostContent, editorID uuid.UUID) error {
	if p.UserID != editorID {
		return errors.ErrCannotEditPost
	}
	if p.IsDeleted {
		return errors.ErrCannotEditPost
	}
	
	p.Content = content
	p.UpdatedAt = time.Now()
	return nil
}

func (p *Post) Delete(deleterID uuid.UUID) error {
	if p.UserID != deleterID {
		return errors.ErrCannotDeletePost
	}
	if p.IsDeleted {
		return errors.ErrCannotDeletePost
	}
	
	now := time.Now()
	p.IsDeleted = true
	p.DeletedAt = &now
	p.UpdatedAt = now
	return nil
}

func (p *Post) IncrementCurseCount() {
	p.CurseCount++
	p.UpdatedAt = time.Now()
}

func (p *Post) DecrementCurseCount() {
	if p.CurseCount > 0 {
		p.CurseCount--
		p.UpdatedAt = time.Now()
	}
}
