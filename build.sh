#!/usr/bin/env bash
set -o errexit

echo "=== AQUA-8 Build Script ==="

echo "[1/4] Installing dependencies..."
pip install -r requirements.txt

echo "[2/4] Collecting static files..."
python manage.py collectstatic --no-input --clear

echo "[3/4] Creating migrations..."
python manage.py makemigrations aqua8 --noinput

echo "[4/4] Running migrations..."
python manage.py migrate --noinput

echo "[5/5] Seeding initial data..."
python manage.py seed_data --noinput 2>/dev/null || echo "  ⚠ seed_data skipped or already seeded"

echo "=== Build complete ==="
