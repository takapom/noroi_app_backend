package handler

import (
	"net/http"
	"noroi/internal/handler/middleware"
	"noroi/internal/usecase"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userUsecase *usecase.UserUsecase
}

func NewUserHandler(userUsecase *usecase.UserUsecase) *UserHandler {
	return &UserHandler{
		userUsecase: userUsecase,
	}
}

// GetProfile handles getting the current user's profile
// GET /users/me
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	profile, err := h.userUsecase.GetProfile(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get profile"})
		return
	}

	c.JSON(http.StatusOK, profile)
}

// UpdateProfile handles updating the current user's profile
// PUT /users/me
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var input usecase.UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	profile, err := h.userUsecase.UpdateProfile(c.Request.Context(), userID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, profile)
}

// GetCurseStyles handles getting all curse styles
// GET /curse-styles
func (h *UserHandler) GetCurseStyles(c *gin.Context) {
	styles, err := h.userUsecase.GetCurseStyles(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get curse styles"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"curse_styles": styles,
	})
}
