package handler

import (
	"net/http"

	"noroi/internal/handler/middleware"
	"noroi/internal/usecase"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ApplicationHandler struct {
	usecase *usecase.ApplicationUsecase
}

func NewApplicationHandler(uc *usecase.ApplicationUsecase) *ApplicationHandler {
	return &ApplicationHandler{usecase: uc}
}

// POST /applications
func (h *ApplicationHandler) Create(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil || userID == (uuid.UUID{}) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req struct {
		CompanyID   string  `json:"company_id" binding:"required"`
		Category    string  `json:"category" binding:"required"`
		Status      string  `json:"status"`
		ColorTag    string  `json:"color_tag"`
		ScheduledAt *string `json:"scheduled_at"`
		Motivation  string  `json:"motivation"`
		WhatToDo    string  `json:"what_to_do"`
		JobAxis     string  `json:"job_axis"`
		Strengths   string  `json:"strengths"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	input := usecase.CreateApplicationInput{
		CompanyID:   req.CompanyID,
		Category:    req.Category,
		Status:      req.Status,
		ColorTag:    req.ColorTag,
		ScheduledAt: req.ScheduledAt,
		Motivation:  req.Motivation,
		WhatToDo:    req.WhatToDo,
		JobAxis:     req.JobAxis,
		Strengths:   req.Strengths,
	}

	result, err := h.usecase.Create(c.Request.Context(), userID, input)
	if err != nil {
		if err.Error() == "application already exists for this company and category" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, result)
}

// PUT /applications/:id
func (h *ApplicationHandler) Update(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil || userID == (uuid.UUID{}) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	appIDStr := c.Param("id")
	appID, err := uuid.Parse(appIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid application id"})
		return
	}

	var req struct {
		Category    string  `json:"category"`
		Status      string  `json:"status"`
		ColorTag    string  `json:"color_tag"`
		ScheduledAt *string `json:"scheduled_at"`
		Motivation  string  `json:"motivation"`
		WhatToDo    string  `json:"what_to_do"`
		JobAxis     string  `json:"job_axis"`
		Strengths   string  `json:"strengths"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	input := usecase.UpdateApplicationInput{
		Category:    req.Category,
		Status:      req.Status,
		ColorTag:    req.ColorTag,
		ScheduledAt: req.ScheduledAt,
		Motivation:  req.Motivation,
		WhatToDo:    req.WhatToDo,
		JobAxis:     req.JobAxis,
		Strengths:   req.Strengths,
	}

	result, err := h.usecase.Update(c.Request.Context(), userID, appID, input)
	if err != nil {
		if err.Error() == "application not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "unauthorized" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}
