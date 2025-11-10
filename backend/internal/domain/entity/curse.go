package entity

import (
	"time"
	"noroi/pkg/errors"
	"github.com/google/uuid"
)

type Curse struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	PostID    uuid.UUID
	RitualID  *uuid.UUID // イベント中の怨念の場合のみ
	CreatedAt time.Time
}

func NewCurse(userID, postID uuid.UUID, post *Post) (*Curse, error) {
	// 自分の投稿には怨念できない
	if post.UserID == userID {
		return nil, errors.ErrCannotCurseSelf
	}
	
	return &Curse{
		ID:        uuid.New(),
		UserID:    userID,
		PostID:    postID,
		CreatedAt: time.Now(),
	}, nil
}

func (c *Curse) SetRitualID(ritualID uuid.UUID) {
	c.RitualID = &ritualID
}
