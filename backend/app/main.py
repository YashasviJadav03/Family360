from fastapi import FastAPI

app = FastAPI(
    title="Family360 API",
    description="Family-Centric Welfare Intelligence & Beneficiary Management Platform",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
