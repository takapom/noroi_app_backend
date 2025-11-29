package docs

import (
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
)

// これは就活ドメイン（Job Application Management）の想定テーブル構造を
// ドキュメントとして型で表したもの。実際のマイグレーションやORM実装で
// この形をベースに外部キー制約などを付与していく。

// companies テーブル（企業マスタ）に対応
type CompanyRecord struct {
	ID             uuid.UUID      `db:"id"`
	Name           string         `db:"name"`
	RecruitmentURL sql.NullString `db:"recruitment_url"`
	Industry       sql.NullString `db:"industry"`
	Location       sql.NullString `db:"location"`
	CreatedAt      time.Time      `db:"created_at"`
	UpdatedAt      time.Time      `db:"updated_at"`
}

// applications テーブル（ユーザーごとの応募・保存単位）に対応
type ApplicationRecord struct {
	ID          uuid.UUID      `db:"id"`
	UserID      uuid.UUID      `db:"user_id"`    // FK -> users.id
	CompanyID   uuid.UUID      `db:"company_id"` // FK -> companies.id
	Category    string         `db:"category"`   // enum: main | intern | info
	Status      string         `db:"status"`     // enum: todo | scheduled | in_progress | done | withdrawn
	ScheduledAt sql.NullTime   `db:"scheduled_at"`
	ColorTag    string         `db:"color_tag"` // enum: orange | purple
	Completed   bool           `db:"completed"`
	Motivation  sql.NullString `db:"motivation"` // 志望理由
	WhatToDo    sql.NullString `db:"what_to_do"` // 入社後にやりたいこと
	JobAxis     sql.NullString `db:"job_axis"`   // 就活軸
	Strengths   sql.NullString `db:"strengths"`  // 自分の強みがどう生きるか
	CreatedAt   time.Time      `db:"created_at"`
	UpdatedAt   time.Time      `db:"updated_at"`
}

// selection_stages テーブル（応募ごとの選考ステップ）に対応
type SelectionStageRecord struct {
	ID            uuid.UUID      `db:"id"`
	ApplicationID uuid.UUID      `db:"application_id"` // FK -> applications.id
	Name          string         `db:"name"`           // ES/一次/二次/最終/内々定/内定
	ScheduledAt   sql.NullTime   `db:"scheduled_at"`
	Status        string         `db:"status"` // enum: pending | passed | failed
	Notes         sql.NullString `db:"notes"`
	CreatedAt     time.Time      `db:"created_at"`
	UpdatedAt     time.Time      `db:"updated_at"`
}

// reminders テーブル（将来のリマインド機能用、任意）に対応
type ReminderRecord struct {
	ID            uuid.UUID `db:"id"`
	ApplicationID uuid.UUID `db:"application_id"` // FK -> applications.id
	TargetAt      time.Time `db:"target_at"`
	Channel       string    `db:"channel"` // enum: in_app | email
	Message       string    `db:"message"`
	CreatedAt     time.Time `db:"created_at"`
	UpdatedAt     time.Time `db:"updated_at"`
}

// ---- ドメインサービスの簡易スケルトン（ドキュメント用の最小実装）----

// ProgressPolicy は応募ステータスの遷移制約を表す。
type ProgressPolicy struct{}

// ValidateStatusTransition:
//
//	todo -> scheduled | in_progress | withdrawn
//	scheduled -> in_progress | withdrawn
//	in_progress -> done | withdrawn
//	done / withdrawn は終端
func (ProgressPolicy) ValidateStatusTransition(current, next string) error {
	allowed := map[string][]string{
		"todo":        {"scheduled", "in_progress", "withdrawn"},
		"scheduled":   {"in_progress", "withdrawn"},
		"in_progress": {"done", "withdrawn"},
		"done":        {},
		"withdrawn":   {},
	}
	for _, n := range allowed[current] {
		if n == next {
			return nil
		}
	}
	return errors.New("invalid status transition: " + current + " -> " + next)
}

// ApplicationScheduler は同一ユーザーの応募予定の時間衝突を検出する。
type ApplicationScheduler struct{}

// HasConflict: シンプルに「同じ日時と完全一致」したら衝突とみなすデモ実装。
func (ApplicationScheduler) HasConflict(existing []ApplicationRecord, candidate ApplicationRecord) bool {
	if candidate.ScheduledAt.Valid {
		target := candidate.ScheduledAt.Time
		for _, a := range existing {
			if a.UserID == candidate.UserID && a.ScheduledAt.Valid && a.ScheduledAt.Time.Equal(target) {
				return true
			}
		}
	}
	return false
}

// ReminderService はリマインドの生成を行うスタブ。
type ReminderService struct{}

func (ReminderService) Build(app ApplicationRecord, channel string, message string, target time.Time) ReminderRecord {
	return ReminderRecord{
		ID:            uuid.New(),
		ApplicationID: app.ID,
		TargetAt:      target,
		Channel:       channel,
		Message:       message,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
}
