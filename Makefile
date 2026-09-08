.PHONY: start dev db-migrate db-seed api-run web-dev test build help

start: dev

dev:
	./start-dashboard.sh

help:
	@echo "ArogyaGrid Run Commands:"
	@echo "  make dev / make start - Launch both Backend & Frontend in a single command"
	@echo "  make api-run          - Run Go backend server on port 8085"
	@echo "  make web-dev          - Run Next.js frontend on port 3000"
	@echo "  make test             - Run all Go backend unit tests"
	@echo "  make db-migrate       - Run PostgreSQL migrations"
	@echo "  make db-seed          - Seed demo data into PostgreSQL"

db-migrate:
	docker exec -i bimanyaya_postgres psql -U arogyagrid -d arogyagrid < apps/api/db/migrations/001_work_schema.sql || \
	docker compose exec -T postgres psql -U arogyagrid -d arogyagrid < apps/api/db/migrations/001_work_schema.sql

db-seed:
	docker exec -i bimanyaya_postgres psql -U arogyagrid -d arogyagrid < scripts/seed/seed_work_items.sql || \
	docker compose exec -T postgres psql -U arogyagrid -d arogyagrid < scripts/seed/seed_work_items.sql

api-run:
	cd apps/api && APP_ENV=development HTTP_PORT=8085 DATABASE_URL="postgres://arogyagrid:arogyagrid_dev@localhost:5432/arogyagrid?sslmode=disable" JWT_SECRET="your-secret-key-min-32-chars-change-me" go run cmd/server/main.go

web-dev:
	cd apps/web && npm run dev

build:
	cd apps/api && go build -buildvcs=false ./...
	cd apps/web && npm run build

test:
	cd apps/api && go test -buildvcs=false ./internal/work/ -v -count=1

