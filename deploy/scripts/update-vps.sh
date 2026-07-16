#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BRANCH="main"

cd "$APP_DIR"

# Verify Docker installation
if ! command -v docker &> /dev/null; then
  echo "[ERROR] Docker tidak terdeteksi di VPS ini."
  echo "Silakan install Docker terlebih dahulu untuk melanjutkan deploy."
  exit 1
fi

# Verify Docker Compose command format
DOCKER_COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null; then
  if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
  else
    echo "[ERROR] Docker Compose tidak terdeteksi."
    echo "Silakan install docker compose plugin atau docker-compose CLI."
    exit 1
  fi
fi

echo "-> Pulling latest code from GitHub youtaid/konstanta-edu-presence ($BRANCH)..."
git fetch --prune origin
git pull --ff-only origin "$BRANCH"

echo "-> Synchronizing environment variables for Docker build..."
if [ -f .env ]; then
  echo "   Menggunakan .env terbaru yang dikirim oleh proses deploy."
else
  echo "[ERROR] .env tidak ditemukan. Deploy dibatalkan."
  exit 1
fi

for required_var in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; do
  if ! grep -Eq "^${required_var}=.+$" .env; then
    echo "[ERROR] ${required_var} tidak tersedia di .env. Deploy dibatalkan."
    exit 1
  fi
done
if ! grep -Eq "^(SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY)=.+$" .env; then
  echo "[ERROR] SUPABASE_SECRET_KEY atau SUPABASE_SERVICE_ROLE_KEY harus tersedia di .env. Deploy dibatalkan."
  exit 1
fi
echo "   Konfigurasi Supabase wajib terdeteksi."

echo "-> Building and starting Docker containers..."
$DOCKER_COMPOSE_CMD up --build -d

echo "-> Verifying Supabase admin credentials inside the container..."
if ! $DOCKER_COMPOSE_CMD exec -T konstanta-edu-presence sh -c \
  'test -n "$SUPABASE_SECRET_KEY" || test -n "$SUPABASE_SERVICE_ROLE_KEY"'; then
  echo "[ERROR] Kredensial admin Supabase tidak masuk ke container."
  exit 1
fi

echo "-> Pruning unused docker images to save disk space..."
docker image prune -f

echo "-> Container status:"
$DOCKER_COMPOSE_CMD ps

echo "-> Deploy selesai sukses!"
