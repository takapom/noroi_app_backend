package value

import "errors"

type ApplicationStatus string

const (
	ApplicationStatusToDo       ApplicationStatus = "todo"
	ApplicationStatusScheduled  ApplicationStatus = "scheduled"
	ApplicationStatusInProgress ApplicationStatus = "in_progress"
	ApplicationStatusDone       ApplicationStatus = "done"
	ApplicationStatusWithdrawn  ApplicationStatus = "withdrawn"
)

func (s ApplicationStatus) Validate() error {
	switch s {
	case ApplicationStatusToDo, ApplicationStatusScheduled, ApplicationStatusInProgress, ApplicationStatusDone, ApplicationStatusWithdrawn:
		return nil
	default:
		return errors.New("invalid application status")
	}
}
