package domain_service

import (
	"errors"

	"noroi/internal/domain/value"
)

// ProgressPolicy は応募ステータスの遷移制約を表す。
type ProgressPolicy struct{}

// ValidateStatusTransition:
//
//	todo -> scheduled | in_progress | withdrawn
//	scheduled -> in_progress | withdrawn
//	in_progress -> done | withdrawn
//	done / withdrawn は終端
func (ProgressPolicy) ValidateStatusTransition(current, next value.ApplicationStatus) error {
	allowed := map[value.ApplicationStatus][]value.ApplicationStatus{
		value.ApplicationStatusToDo:       {value.ApplicationStatusScheduled, value.ApplicationStatusInProgress, value.ApplicationStatusWithdrawn},
		value.ApplicationStatusScheduled:  {value.ApplicationStatusInProgress, value.ApplicationStatusWithdrawn},
		value.ApplicationStatusInProgress: {value.ApplicationStatusDone, value.ApplicationStatusWithdrawn},
		value.ApplicationStatusDone:       {},
		value.ApplicationStatusWithdrawn:  {},
	}
	for _, n := range allowed[current] {
		if n == next {
			return nil
		}
	}
	return errors.New("invalid status transition: " + string(current) + " -> " + string(next))
}
