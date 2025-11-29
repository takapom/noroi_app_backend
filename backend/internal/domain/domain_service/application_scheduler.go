package domain_service

import (
	"noroi/internal/domain/entity"
)

// ApplicationScheduler は同一ユーザーの応募予定の時間衝突を検出する。
type ApplicationScheduler struct{}

// HasConflict: シンプルに「同じ日時と完全一致」したら衝突とみなすデモ実装。
func (ApplicationScheduler) HasConflict(existing []entity.Application, candidate entity.Application) bool {
	if candidate.ScheduledAt == nil {
		return false
	}
	for _, a := range existing {
		if a.UserID == candidate.UserID && a.ScheduledAt != nil && a.ScheduledAt.Equal(*candidate.ScheduledAt) {
			return true
		}
	}
	return false
}
