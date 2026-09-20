import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

from app.db.session import SessionLocal
from app.models.family import Family


def seed_if_empty():
    db = SessionLocal()
    try:
        family_count = db.query(Family).count()
        if family_count > 0:
            print(f"[Seed] Database already contains {family_count} families. Skipping seed.")
            return

        print("[Seed] Database is empty! Running initial dataset generator...")
        # Use 300 families for faster boot on free-tier containers unless overridden
        if "SEED_FAMILIES_COUNT" not in os.environ:
            os.environ["SEED_FAMILIES_COUNT"] = "300"

        from scripts.generate_dataset import main as run_generator
        run_generator()
        print("[Seed] Initial dataset generation completed successfully.")
    except Exception as e:
        print(f"[Seed] Warning during database check/seeding: {e}")
        # Re-raise so deployment logs capture the exact failure if DB connection failed
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_if_empty()
