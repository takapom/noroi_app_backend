package handler

import (
	"net/http"
	"noroi/internal/usecase"
	"noroi/pkg/errors"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authUsecase *usecase.AuthUsecase
}

func NewAuthHandler(authUsecase *usecase.AuthUsecase) *AuthHandler {
	return &AuthHandler{
		authUsecase: authUsecase,
	}
}

// Register handles user registration
// POST /auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var input usecase.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	response, err := h.authUsecase.Register(c.Request.Context(), input)
	if err != nil {
		statusCode := http.StatusInternalServerError
		errorMessage := "internal server error"

		switch err {
		case errors.ErrEmailAlreadyExists:
			statusCode = http.StatusConflict
			errorMessage = "email already exists"
		case errors.ErrInvalidEmail:
			statusCode = http.StatusBadRequest
			errorMessage = "invalid email format"
		case errors.ErrInvalidPassword, errors.ErrPasswordTooShort:
			statusCode = http.StatusBadRequest
			errorMessage = err.Error()
		case errors.ErrCurseStyleNotFound:
			statusCode = http.StatusBadRequest
			errorMessage = "invalid curse style"
		}

		c.JSON(statusCode, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// Login handles user login
// POST /auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var input usecase.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	response, err := h.authUsecase.Login(c.Request.Context(), input)
	if err != nil {
		if err == errors.ErrInvalidCredentials {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// RefreshToken handles token refresh
// POST /auth/refresh
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var request struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "refresh token required"})
		return
	}

	newAccessToken, err := h.authUsecase.RefreshToken(c.Request.Context(), request.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": newAccessToken,
	})
}
