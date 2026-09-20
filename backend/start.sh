#!/usr/bin/env bash
set -e

# If DATABASE_URL is not set or points to localhost in a production cloud environment,
# fall back to SQLite so the service never crashes
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"localhost"* ]]; then
  echo "[Family360] Notice: No external PostgreSQL DATABASE_URL found or pointing to localhost."
  echo "[Family360] Defaulting to SQLite database: sqlite:///./family360.db"
  export DATABASE_URL="sqlite:///./family360.db"
else
  echo "[Family360] Connecting to configured database: ${DATABASE_URL%%:*}://..."
fi

echo "[Family360] Applying database migrations..."
python -m alembic upgrade head

echo "[Family360] Checking and seeding database if empty..."
python scripts/seed_if_empty.py

echo "[Family360] Starting Uvicorn API server on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
