package value

import "errors"

type ApplicationCategory string

const (
	ApplicationCategoryMain   ApplicationCategory = "main"   // 本選考
	ApplicationCategoryIntern ApplicationCategory = "intern" // インターン
	ApplicationCategoryInfo   ApplicationCategory = "info"   // 説明会
)

func (c ApplicationCategory) Validate() error {
	switch c {
	case ApplicationCategoryMain, ApplicationCategoryIntern, ApplicationCategoryInfo:
		return nil
	default:
		return errors.New("invalid application category")
	}
}
