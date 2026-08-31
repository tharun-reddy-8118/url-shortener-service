from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.exception import (
    URLExpiredError,
    URLInactiveError,
    URLNotFoundError,
)
from app.db.models import User
from app.db.session import get_db
from app.schemas.click import ClickCountResponse, ClickResponse
from app.schemas.url import URLCreate, URLResponse
from app.services.click_service import (
    get_url_click_count,
    get_url_click_history,
    record_click,
)
from app.services.url_service import (
    activate_user_url,
    create_short_url,
    deactivate_user_url,
    get_active_url,
    get_user_urls,
)


router = APIRouter(
    prefix="/urls",
    tags=["urls"],
)


@router.post(
    "",
    response_model=URLResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_url_endpoint(
    url_data: URLCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_short_url(db, url_data, current_user)


@router.get(
    "",
    response_model=list[URLResponse],
)
def get_my_urls(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_urls(db, current_user)


@router.get("/{short_code}")
def get_url(
    short_code: str,
    request: Request,
    db: Session = Depends(get_db),
):
    try:
        url = get_active_url(db, short_code)

        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        referrer = request.headers.get("referer")

        record_click(
            db,
            url,
            ip_address,
            user_agent,
            referrer,
        )

        return RedirectResponse(
            url=str(url.original_url),
            status_code=307,
        )

    except URLNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except URLInactiveError as e:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail=str(e),
        )

    except URLExpiredError as e:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail=str(e),
        )


@router.patch(
    "/{url_id}/deactivate",
    response_model=URLResponse,
)
def deactivate_url(
    url_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return deactivate_user_url(
            db,
            url_id,
            current_user,
        )

    except URLNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.patch(
    "/{url_id}/activate",
    response_model=URLResponse,
)
def activate_url(
    url_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return activate_user_url(
            db,
            url_id,
            current_user,
        )

    except URLNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get(
    "/{url_id}/clicks",
    response_model=ClickCountResponse,
)
def get_clicks(
    url_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        total_clicks = get_url_click_count(
            db,
            url_id,
            current_user,
        )

        return {
            "url_id": url_id,
            "total_clicks": total_clicks,
        }

    except URLNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get(
    "/{url_id}/clicks/history",
    response_model=list[ClickResponse],
)
def get_click_history(
    url_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return get_url_click_history(
            db,
            url_id,
            current_user,
        )

    except URLNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )