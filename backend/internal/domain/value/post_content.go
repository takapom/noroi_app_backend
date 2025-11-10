package value

import (
	"noroi/pkg/errors"
	"strings"
	"unicode/utf8"
)

type PostContent struct {
	value string
}

func NewPostContent(content string) (PostContent, error) {
	content = strings.TrimSpace(content)
	length := utf8.RuneCountInString(content)
	
	if length < 10 {
		return PostContent{}, errors.ErrPostTooShort
	}
	if length > 300 {
		return PostContent{}, errors.ErrPostTooLong
	}
	
	return PostContent{value: content}, nil
}

func (pc PostContent) String() string {
	return pc.value
}

func (pc PostContent) Length() int {
	return utf8.RuneCountInString(pc.value)
}
