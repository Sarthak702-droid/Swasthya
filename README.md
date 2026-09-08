# ArogyaGrid

The Intelligent Health Resource Grid

## Tech Stack
- Backend: Go, Chi, PostgreSQL, sqlc
- Frontend: Next.js (Web)
- Infrastructure: Docker, Make

## Getting Started

1. Set up env variables:
   `cp .env.example .env`
2. Start the database:
   `make db-up`
3. Run migrations:
   `make db-migrate`
4. Seed the database:
   `make db-seed`
5. Run API:
   `make api-run`
6. Run Web:
   `make web-dev`

## API Endpoints
- GET /health/live
- GET /health/ready
- API endpoints under /api/v1/work

## Team Members
- Sarthak
- Vaishnavi
- Riya
- Shneanjali

## Architecture
[Frontend (Next.js)] <---> [Backend API (Go)] <---> [PostgreSQL Database]
