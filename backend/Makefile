.PHONY: help build run test clean docker-up docker-down migrate-up migrate-down migrate-create

help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Build the application
	go build -o main ./cmd/api

run: ## Run the application
	go run ./cmd/api/main.go

test: ## Run tests
	go test -v ./...

clean: ## Clean build artifacts
	rm -f main
	go clean

docker-up: ## Start all services with docker-compose
	docker-compose up -d

docker-down: ## Stop all services
	docker-compose down

docker-build: ## Build docker image
	docker-compose build

docker-logs: ## Show docker logs
	docker-compose logs -f

migrate-up: ## Run database migrations
	docker-compose run --rm migrate -path /migrations -database "postgres://noroi:noroi_password@db:5432/noroi_db?sslmode=disable" up

migrate-down: ## Rollback database migrations
	docker-compose run --rm migrate -path /migrations -database "postgres://noroi:noroi_password@db:5432/noroi_db?sslmode=disable" down

migrate-create: ## Create a new migration file (usage: make migrate-create name=migration_name)
	@if [ -z "$(name)" ]; then \
		echo "Error: name is required. Usage: make migrate-create name=migration_name"; \
		exit 1; \
	fi
	migrate create -ext sql -dir migrations -seq $(name)

mod-download: ## Download Go modules
	go mod download

mod-tidy: ## Tidy Go modules
	go mod tidy
