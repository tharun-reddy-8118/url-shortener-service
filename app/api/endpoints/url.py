from fastapi import APIRouter, Depends, HTTPException, status , Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.db.models import URL, User
from app.db.session import get_db
from app.repositories.url_repository import get_url_by_short_code
from app.schemas.url import URLCreate, URLResponse
from app.api.dependencies import get_current_user
from app.services.url_service import create_short_url
from app.services.click_service import record_click

router=APIRouter(prefix="/urls",tags=["urls"])

@router.post("",response_model=URLResponse,status_code=status.HTTP_201_CREATED)
def create_url_endpoint(
    url_data: URLCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
        url = create_short_url(db, url_data, current_user)
        return url
@router.get("/{short_code}")
def get_url(short_code: str,request: Request,db: Session = Depends(get_db),):
    url=get_url_by_short_code(db,short_code)
    if not url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="URL not found"
        )
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    referrer = request.headers.get("referer")
    
    record_click(
        db,url,ip_address,user_agent,referrer,
    )
    return RedirectResponse(
        url=str(url.original_url),
        status_code=307,
    )
