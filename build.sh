#!/usr/bin/env bash
set -o errexit

echo "=== AQUA-8 Build Script ==="

echo "[1/4] Installing dependencies..."
pip install -r requirements.txt

echo "[2/4] Collecting static files..."
python manage.py collectstatic --no-input --clear

echo "[3/4] Running migrations..."
python manage.py migrate --noinput

echo "[4/4] Seeding initial data..."
python manage.py seed_data --noinput || echo "  ⚠ seed_data skipped (may already exist)"

echo "=== Build complete ==="
