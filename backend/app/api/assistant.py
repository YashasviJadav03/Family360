from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.assistant_service import process_officer_query

router = APIRouter(prefix="/assistant", tags=["Officer AI Assistant"])


class QueryRequest(BaseModel):
    question: str


class QueryLink(BaseModel):
    label: str
    url: str


class QueryResponse(BaseModel):
    question: str
    intent: str
    answer: str
    data: dict
    suggested_links: list[QueryLink] = []


@router.post(
    "/query",
    response_model=QueryResponse,
    summary="Natural-Language Officer Query Assistant",
    description=(
        "Processes officer natural-language queries using intent-matching over a fixed template set. "
        "Underlying data is fetched deterministically and phrased in plain administrative language. "
        "Per system architecture, this does NOT use open-ended text-to-SQL or determine eligibility."
    ),
)
def assistant_query(payload: QueryRequest, db: Session = Depends(get_db)):
    if not payload.question or not payload.question.strip():
        raise HTTPException(status_code=400, detail="Query question cannot be empty")

    result = process_officer_query(payload.question, db)
    return QueryResponse(
        question=payload.question,
        intent=result.get("intent", "UNKNOWN"),
        answer=result.get("answer", ""),
        data=result.get("data", {}),
        suggested_links=result.get("suggested_links", []),
    )
