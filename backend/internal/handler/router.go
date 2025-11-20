package handler

import (
	"database/sql"
	"noroi/internal/handler/middleware"
	"noroi/internal/infrastructure/repository"
	"noroi/internal/usecase"
	"noroi/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func NewRouter(db *sql.DB) *gin.Engine {
	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	curseStyleRepo := repository.NewCurseStyleRepository(db)
	postRepo := repository.NewPostRepository(db)
	curseRepo := repository.NewCurseRepository(db)

	// Initialize JWT manager
	jwtManager := jwt.NewManager()

	// Initialize use cases
	authUsecase := usecase.NewAuthUsecase(userRepo, curseStyleRepo, jwtManager)
	postUsecase := usecase.NewPostUsecase(postRepo, curseRepo, userRepo, curseStyleRepo)
	curseUsecase := usecase.NewCurseUsecase(postRepo, curseRepo)
	userUsecase := usecase.NewUserUsecase(userRepo, curseStyleRepo, postRepo)

	// Initialize handlers
	authHandler := NewAuthHandler(authUsecase)
	postHandler := NewPostHandler(postUsecase)
	curseHandler := NewCurseHandler(curseUsecase)
	userHandler := NewUserHandler(userUsecase)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(jwtManager)

	// Create router
	router := gin.Default()

	// Global middleware
	router.Use(middleware.CORS())
	router.Use(middleware.Logger())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Authentication routes (no auth required)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
		}

		// Curse styles (no auth required for now, can be changed)
		v1.GET("/curse-styles", userHandler.GetCurseStyles)

		// Protected routes (auth required)
		protected := v1.Group("")
		protected.Use(authMiddleware.RequireAuth())
		{
			// Post routes
			posts := protected.Group("/posts")
			{
				posts.GET("", postHandler.GetTimeline)
				posts.POST("", postHandler.CreatePost)
				posts.PUT("/:id", postHandler.UpdatePost)
				posts.DELETE("/:id", postHandler.DeletePost)
				posts.POST("/:id/curse", curseHandler.CursePost)
				posts.DELETE("/:id/curse", curseHandler.UncursePost)
			}

			// User routes
			users := protected.Group("/users")
			{
				users.GET("/me", userHandler.GetProfile)
				users.PUT("/me", userHandler.UpdateProfile)
				users.GET("/me/posts", userHandler.GetMyPosts)
			}
		}
	}

	return router
}
