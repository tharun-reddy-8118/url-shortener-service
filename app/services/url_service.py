import secrets
import string
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exception import (
    URLExpiredError,
    URLInactiveError,
    URLNotFoundError,
)
from app.db.models import URL, User
from app.repositories.url_repository import (
    create_url,
    get_url_by_id,
    get_url_by_short_code,
    get_urls_by_user_id,
)
from app.schemas.url import URLCreate


def generate_short_code(length: int = 7) -> str:
    characters = string.ascii_letters + string.digits
    return "".join(
        secrets.choice(characters)
        for _ in range(length)
    )


def create_short_url(
    db: Session,
    url_data: URLCreate,
    current_user: User,
) -> URL:
    for _ in range(5):
        short_code = generate_short_code()

        if not get_url_by_short_code(db, short_code):
            break
    else:
        raise Exception("Could not generate a unique short code")

    url = URL(
        original_url=str(url_data.original_url),
        short_code=short_code,
        user_id=current_user.id,
    )

    return create_url(db, url)


def get_active_url(db: Session, short_code: str) -> URL:
    url = get_url_by_short_code(db, short_code)

    if not url:
        raise URLNotFoundError("URL not found")

    if not url.is_active:
        raise URLInactiveError("URL is inactive")

    if url.expires_at is not None:
        expires_at = url.expires_at

        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at <= datetime.now(timezone.utc):
            raise URLExpiredError("URL has expired")

    return url


def get_user_urls(
    db: Session,
    current_user: User,
) -> list[URL]:
    return get_urls_by_user_id(db, current_user.id)


def deactivate_user_url(
    db: Session,
    url_id: int,
    current_user: User,
) -> URL:
    url = get_url_by_id(db, url_id)

    if not url or url.user_id != current_user.id:
        raise URLNotFoundError("URL not found")

    url.is_active = False

    db.commit()
    db.refresh(url)

    return url


def activate_user_url(
    db: Session,
    url_id: int,
    current_user: User,
) -> URL:
    url = get_url_by_id(db, url_id)

    if not url or url.user_id != current_user.id:
        raise URLNotFoundError("URL not found")

    url.is_active = True

    db.commit()
    db.refresh(url)

    return url