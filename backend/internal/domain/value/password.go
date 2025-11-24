package value

import (
	"golang.org/x/crypto/bcrypt"
	"noroi/pkg/errors"
)

type Password struct {
	hashedValue string
}

func NewPassword(plainPassword string) (Password, error) {
	if len(plainPassword) < 8 {
		return Password{}, errors.ErrPasswordTooShort
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
	if err != nil {
		return Password{}, err
	}

	return Password{hashedValue: string(hashed)}, nil
}

func NewPasswordFromHash(hashedPassword string) Password {
	return Password{hashedValue: hashedPassword}
}

func (p Password) Hash() string {
	return p.hashedValue
}

func (p Password) Compare(plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(p.hashedValue), []byte(plainPassword))
	return err == nil
}
