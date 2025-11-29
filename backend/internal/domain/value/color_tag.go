package value

import "errors"

type ColorTag string

const (
	ColorTagOrange ColorTag = "orange"
	ColorTagPurple ColorTag = "purple"
)

func (c ColorTag) Validate() error {
	switch c {
	case ColorTagOrange, ColorTagPurple:
		return nil
	default:
		return errors.New("invalid color tag")
	}
}
