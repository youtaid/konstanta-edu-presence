#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/konstanta-edu-presence"
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
if [ -f .env.local ]; then
  cp .env.local .env
  echo "   .env.local berhasil disalin ke .env."
elif [ -f .env ]; then
  echo "   Menggunakan file .env yang sudah ada."
else
  echo "[WARNING] .env atau .env.local tidak ditemukan! Docker build mungkin kekurangan environment variables."
fi

echo "-> Building and starting Docker containers..."
$DOCKER_COMPOSE_CMD up --build -d

echo "-> Pruning unused docker images to save disk space..."
docker image prune -f

echo "-> Container status:"
$DOCKER_COMPOSE_CMD ps

echo "-> Deploy selesai sukses!"
