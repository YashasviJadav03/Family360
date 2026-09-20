from fastapi import APIRouter
from app.api.families import router as families_router
from app.api.schemes import router as schemes_router
from app.api.dashboard import router as dashboard_router
from app.api.officers import router as officers_router
from app.api.applications import router as applications_router
from app.api.duplicates import router as duplicates_router
from app.api.assistant import router as assistant_router

api_router = APIRouter(prefix="/api")
api_router.include_router(families_router)
api_router.include_router(schemes_router)
api_router.include_router(dashboard_router)
api_router.include_router(officers_router)
api_router.include_router(applications_router)
api_router.include_router(duplicates_router)
api_router.include_router(assistant_router)
