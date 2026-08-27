from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models import User

from app.core.config import settings
from app.db.session import get_db
from app.api.endpoints.users import router as user_router
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.url import router as url_router


app = FastAPI(
    title=settings.app_name,
)

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(url_router)
@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/db")
def database_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": "connected",
    }


