package docs

import "time"

// Company は企業マスタの簡易モデル。
// ドキュメント用にシンプルに定義しており、実ドメイン層では拡張・差し替え可能。
type Company struct {
	ID             string  `json:"id"`
	Name           string  `json:"name"`
	RecruitmentURL *string `json:"recruitment_url,omitempty"`
	Industry       *string `json:"industry,omitempty"`
	Location       *string `json:"location,omitempty"`
}

// Application はユーザーの応募（興味）を表す集約ルート。
type Application struct {
	ID          string              `json:"id"`
	UserID      string              `json:"user_id"`
	CompanyID   string              `json:"company_id"`
	Category    ApplicationCategory `json:"category"`
	Status      ApplicationStatus   `json:"status"`
	ScheduledAt *time.Time          `json:"scheduled_at,omitempty"`
	ColorTag    ColorTag            `json:"color_tag"`
	Completed   bool                `json:"completed"`
	CreatedAt   time.Time           `json:"created_at"`
	UpdatedAt   time.Time           `json:"updated_at"`
	Notes       ApplicationNote     `json:"notes"`
	Stages      []SelectionStage    `json:"stages"`
	Reminders   []Reminder          `json:"reminders,omitempty"`
}

// ApplicationNote は応募ごとにユーザーが保持するメモ。
type ApplicationNote struct {
	Motivation string `json:"motivation"` // 志望理由
	WhatToDo   string `json:"what_to_do"` // 入社後に何をしたいか
	JobAxis    string `json:"job_axis"`   // 就活軸
	Strengths  string `json:"strengths"`  // 自分の強みがどう生きるか
}

// SelectionStage は選考プロセスの各ステップ。
type SelectionStage struct {
	ID            string               `json:"id"`
	ApplicationID string               `json:"application_id"`
	Name          string               `json:"name"` // e.g. ES/一次/二次/最終/内々定/内定
	ScheduledAt   *time.Time           `json:"scheduled_at,omitempty"`
	Status        SelectionStageStatus `json:"status"`
	Notes         string               `json:"notes,omitempty"`
}

// Reminder は将来のリマインド通知用の概念。
type Reminder struct {
	TargetAt time.Time       `json:"target_at"`
	Channel  ReminderChannel `json:"channel"`
	Message  string          `json:"message"`
}

type ApplicationCategory string

const (
	ApplicationCategoryMain   ApplicationCategory = "main"   // 本選考
	ApplicationCategoryIntern ApplicationCategory = "intern" // インターン
	ApplicationCategoryInfo   ApplicationCategory = "info"   // 説明会
)

type ApplicationStatus string

const (
	ApplicationStatusToDo       ApplicationStatus = "todo"
	ApplicationStatusScheduled  ApplicationStatus = "scheduled"
	ApplicationStatusInProgress ApplicationStatus = "in_progress"
	ApplicationStatusDone       ApplicationStatus = "done"
	ApplicationStatusWithdrawn  ApplicationStatus = "withdrawn"
)

type SelectionStageStatus string

const (
	SelectionStagePending SelectionStageStatus = "pending"
	SelectionStagePassed  SelectionStageStatus = "passed"
	SelectionStageFailed  SelectionStageStatus = "failed"
)

type ColorTag string

const (
	ColorTagOrange ColorTag = "orange"
	ColorTagPurple ColorTag = "purple"
)

type ReminderChannel string

const (
	ReminderChannelInApp ReminderChannel = "in_app"
	ReminderChannelEmail ReminderChannel = "email"
)
