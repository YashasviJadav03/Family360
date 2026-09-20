#!/usr/bin/env bash
set -e

echo "[Family360] Applying database migrations..."
python -m alembic upgrade head

echo "[Family360] Checking and seeding database if empty..."
python scripts/seed_if_empty.py

echo "[Family360] Starting Uvicorn API server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
