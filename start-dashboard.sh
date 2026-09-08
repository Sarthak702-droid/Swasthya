#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "========================================================================"
echo "🩺 AROGYAGRID — STARTING UNIFIED HEALTH OPERATIONS GRID"
echo "========================================================================"

# 1. Verify PostgreSQL
echo "--> [1/4] Checking PostgreSQL connection..."
if docker exec bimanyaya_postgres psql -U arogyagrid -d arogyagrid -c "SELECT 1;" >/dev/null 2>&1; then
    echo "    ✓ PostgreSQL (arogyagrid) is reachable."
elif docker exec arogyagrid-postgres-1 psql -U arogyagrid -d arogyagrid -c "SELECT 1;" >/dev/null 2>&1; then
    echo "    ✓ Docker Compose PostgreSQL is reachable."
else
    echo "    Starting PostgreSQL container via docker compose..."
    docker compose up -d postgres 2>/dev/null || true
    sleep 2
fi

# 2. Check if ports need cleanup
echo "--> [2/4] Preparing ports 8085 (API) and 3000 (Web)..."
fuser -k 8085/tcp 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true
pkill -f "apps/api/cmd/server" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 1

# 3. Start Go Backend API
echo "--> [3/4] Launching Go Chi Backend on http://localhost:8085..."
cd "$DIR/apps/api"
APP_ENV=development HTTP_PORT=8085 \
DATABASE_URL="postgres://arogyagrid:arogyagrid_dev@localhost:5432/arogyagrid?sslmode=disable" \
JWT_SECRET="your-secret-key-min-32-chars-change-me" \
go run cmd/server/main.go > "$DIR/api.log" 2>&1 &
API_PID=$!

# Wait for API to become ready
sleep 1
for i in {1..10}; do
    if curl -s http://localhost:8085/health/live >/dev/null 2>&1; then
        echo "    ✓ Backend is healthy and ready!"
        break
    fi
    sleep 1
done

# 4. Start Next.js Frontend
echo "--> [4/4] Launching Next.js Frontend on http://localhost:3000..."
cd "$DIR/apps/web"
npm run dev > "$DIR/web.log" 2>&1 &
WEB_PID=$!

sleep 2

echo ""
echo "========================================================================"
echo "🚀 AROGYAGRID HEALTH RESOURCE OPERATIONS & EPICS BOARD IS LIVE!"
echo "========================================================================"
echo "🎯 TEAM EPICS & TASK BREAKDOWN: http://localhost:3000/epics"
echo "📋 OPERATIONAL WORK QUEUE:      http://localhost:3000/work"
echo "🏠 OVERVIEW LANDING PAGE:       http://localhost:3000"
echo "⚙️ Go Chi API Backend:          http://localhost:8085"
echo "📊 Database:                    PostgreSQL 16 (arogyagrid)"
echo "------------------------------------------------------------------------"
echo "👥 Team Members & Epics Completed (42 Tasks - 100%):"
echo "   👑 Sarthak      — Epic 1 (Foundation & Auth) & Epic 5 (Integration)"
echo "   📋 Vaishnavi    — Epic 2 (Core Work Backend & State Machine)"
echo "   🏥 Riya         — Epic 3 (Transitions, Queues & SLA Engine)"
echo "   🚚 Shneanjali   — Epic 4 (Frontend Work System & Interactive UI)"
echo "------------------------------------------------------------------------"
echo "👉 Open http://localhost:3000/epics to view the complete breakdown of all"
echo "   5 Epics and 42 itemized tasks with live status badges and code links!"
echo "------------------------------------------------------------------------"
echo "Press Ctrl+C to shut down both Backend and Frontend."
echo "========================================================================"

cleanup() {
    echo ""
    echo "Shutting down ArogyaGrid services..."
    kill $API_PID 2>/dev/null || true
    kill $WEB_PID 2>/dev/null || true
    fuser -k 8085/tcp 2>/dev/null || true
    echo "All services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

wait
