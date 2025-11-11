package handler

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"noroi/internal/handler/middleware"
	"noroi/internal/usecase"
	"noroi/pkg/errors"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type PostHandler struct {
	postUsecase *usecase.PostUsecase
}

func NewPostHandler(postUsecase *usecase.PostUsecase) *PostHandler {
	return &PostHandler{
		postUsecase: postUsecase,
	}
}

// GetTimeline handles getting the timeline
// GET /posts
func (h *PostHandler) GetTimeline(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Parse query parameters
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	posts, err := h.postUsecase.GetTimeline(c.Request.Context(), userID, offset, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get timeline"})
		return
	}

	c.JSON(http.StatusOK, posts)
}

// CreatePost handles creating a new post
// POST /posts
func (h *PostHandler) CreatePost(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Read raw body for debugging
	bodyBytes, _ := c.GetRawData()
	c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	fmt.Printf("DEBUG: Received POST /posts request body: %s\n", string(bodyBytes))

	var input usecase.CreatePostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Printf("DEBUG: JSON binding error: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body", "details": err.Error()})
		return
	}

	fmt.Printf("DEBUG: Parsed input - Content: %s, IsAnonymous: %v\n", input.Content, input.IsAnonymous)

	post, err := h.postUsecase.CreatePost(c.Request.Context(), userID, input)
	if err != nil {
		statusCode := http.StatusInternalServerError
		errorMessage := "failed to create post"

		switch err {
		case errors.ErrPostTooShort:
			statusCode = http.StatusBadRequest
			errorMessage = "post must be at least 10 characters"
		case errors.ErrPostTooLong:
			statusCode = http.StatusBadRequest
			errorMessage = "post must be 300 characters or less"
		}

		c.JSON(statusCode, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusCreated, post)
}

// UpdatePost handles updating a post
// PUT /posts/:id
func (h *PostHandler) UpdatePost(c *gin.Context) {
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

	var input usecase.UpdatePostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	err = h.postUsecase.UpdatePost(c.Request.Context(), postID, userID, input)
	if err != nil {
		statusCode := http.StatusInternalServerError
		errorMessage := "failed to update post"

		switch err {
		case errors.ErrPostNotFound:
			statusCode = http.StatusNotFound
			errorMessage = "post not found"
		case errors.ErrCannotEditPost:
			statusCode = http.StatusForbidden
			errorMessage = "cannot edit this post"
		case errors.ErrPostTooShort:
			statusCode = http.StatusBadRequest
			errorMessage = "post must be at least 10 characters"
		case errors.ErrPostTooLong:
			statusCode = http.StatusBadRequest
			errorMessage = "post must be 300 characters or less"
		}

		c.JSON(statusCode, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "post updated successfully"})
}

// DeletePost handles deleting a post
// DELETE /posts/:id
func (h *PostHandler) DeletePost(c *gin.Context) {
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

	err = h.postUsecase.DeletePost(c.Request.Context(), postID, userID)
	if err != nil {
		statusCode := http.StatusInternalServerError
		errorMessage := "failed to delete post"

		switch err {
		case errors.ErrPostNotFound:
			statusCode = http.StatusNotFound
			errorMessage = "post not found"
		case errors.ErrCannotDeletePost:
			statusCode = http.StatusForbidden
			errorMessage = "cannot delete this post"
		}

		c.JSON(statusCode, gin.H{"error": errorMessage})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "post deleted successfully"})
}
