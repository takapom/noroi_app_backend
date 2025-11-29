package handler

import (
	"net/http"
	"strconv"
	"strings"

	"noroi/internal/handler/middleware"
	"noroi/internal/usecase"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CompanyHandler struct {
	usecase *usecase.CompanyUsecase
}

func NewCompanyHandler(uc *usecase.CompanyUsecase) *CompanyHandler {
	return &CompanyHandler{usecase: uc}
}

// GET /companies
func (h *CompanyHandler) List(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil || userID == (uuid.UUID{}) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	limit := parseIntDefault(c.Query("limit"), 20)
	offset := parseIntDefault(c.Query("offset"), 0)
	filterMy := strings.ToLower(c.Query("filter")) == "my"
	category := c.Query("category")
	status := c.Query("status")
	search := c.Query("search")

	input := usecase.CompanyListInput{
		Limit:    limit,
		Offset:   offset,
		FilterMy: filterMy,
		Category: category,
		Status:   status,
		Search:   search,
	}

	result, err := h.usecase.List(c.Request.Context(), userID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": result,
		"pagination": gin.H{
			"limit":  limit,
			"offset": offset,
		},
	})
}

// company creation
func (h *CompanyHandler) CreateCompany(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil || userID == (uuid.UUID{}) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req struct {
		Name           string  `json:"name" binding:"required"`
		RecruitmentURL *string `json:"recruitment_url"`
		Industry       *string `json:"industry"`
		Location       *string `json:"location"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	input := usecase.CreateCompanyInput{
		Name:           req.Name,
		RecruitmentURL: req.RecruitmentURL,
		Industry:       req.Industry,
		Location:       req.Location,
	}

	result, err := h.usecase.Create(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, result)
}

func parseIntDefault(s string, def int) int {
	if s == "" {
		return def
	}
	if v, err := strconv.Atoi(s); err == nil {
		return v
	}
	return def
}
