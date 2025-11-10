package handler

import (
	"net/http"
	"noroi/internal/handler/middleware"
	"noroi/internal/usecase"
	"noroi/pkg/errors"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CurseHandler struct {
	curseUsecase *usecase.CurseUsecase
}

func NewCurseHandler(curseUsecase *usecase.CurseUsecase) *CurseHandler {
	return &CurseHandler{
		curseUsecase: curseUsecase,
	}
}

// CursePost handles cursing (liking) a post
// POST /posts/:id/curse
func (h *CurseHandler) CursePost(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post ID"})
		return
	}

	err = h.curseUsecase.CursePost(c.Request.Context(), userID, postID)
	if err != nil {
		statusCode := http.StatusInternalServerError
		errorMessage := "failed to curse post"

		switch err {
		case errors.ErrAlreadyCursed:
			statusCode = http.StatusConflict
			errorMessage = "already cursed this post"
		case errors.ErrCannotCurseSelf:
			statusCode = http.StatusBadRequest
			errorMessage = "cannot curse your own post"
		case errors.ErrPostNotFound:
			statusCode = http.StatusNotFound
			errorMessage = "post not found"
		}

		c.JSON(statusCode, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "post cursed successfully"})
}

// UncursePost handles uncursing (unliking) a post
// DELETE /posts/:id/curse
func (h *CurseHandler) UncursePost(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post ID"})
		return
	}

	err = h.curseUsecase.UncursePost(c.Request.Context(), userID, postID)
	if err != nil {
		statusCode := http.StatusInternalServerError
		errorMessage := "failed to uncurse post"

		switch err {
		case errors.ErrCurseNotFound:
			statusCode = http.StatusNotFound
			errorMessage = "curse not found"
		case errors.ErrPostNotFound:
			statusCode = http.StatusNotFound
			errorMessage = "post not found"
		}

		c.JSON(statusCode, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "post uncursed successfully"})
}
