from sqlalchemy.orm import Session

from app.core.exception import URLNotFoundError
from app.db.models import Click, URL, User
from app.repositories.click_repository import (
    create_click,
    get_click_count,
    get_clicks_by_url_id,
)
from app.repositories.url_repository import get_url_by_id


def record_click(
    db: Session,
    url: URL,
    ip_address: str | None = None,
    user_agent: str | None = None,
    referrer: str | None = None,
) -> Click:
    click = Click(
        url_id=url.id,
        ip_address=ip_address,
        user_agent=user_agent,
        referrer=referrer,
    )

    return create_click(db, click)


def get_url_click_count(
    db: Session,
    url_id: int,
    current_user: User,
) -> int:
    url = get_url_by_id(db, url_id)

    if not url or url.user_id != current_user.id:
        raise URLNotFoundError("URL not found")

    return get_click_count(db, url_id)


def get_url_click_history(
    db: Session,
    url_id: int,
    current_user: User,
) -> list[Click]:
    url = get_url_by_id(db, url_id)

    if not url or url.user_id != current_user.id:
        raise URLNotFoundError("URL not found")

    return get_clicks_by_url_id(db, url_id)