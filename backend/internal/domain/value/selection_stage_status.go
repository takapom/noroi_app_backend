package value

import "errors"

type SelectionStageStatus string

const (
	SelectionStagePending SelectionStageStatus = "pending"
	SelectionStagePassed  SelectionStageStatus = "passed"
	SelectionStageFailed  SelectionStageStatus = "failed"
)

func (s SelectionStageStatus) Validate() error {
	switch s {
	case SelectionStagePending, SelectionStagePassed, SelectionStageFailed:
		return nil
	default:
		return errors.New("invalid selection stage status")
	}
}
