package value

import "errors"

type ReminderChannel string

const (
	ReminderChannelInApp ReminderChannel = "in_app"
	ReminderChannelEmail ReminderChannel = "email"
)

func (c ReminderChannel) Validate() error {
	switch c {
	case ReminderChannelInApp, ReminderChannelEmail:
		return nil
	default:
		return errors.New("invalid reminder channel")
	}
}
