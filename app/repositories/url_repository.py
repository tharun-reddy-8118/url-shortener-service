from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.models import URL


def create_url(db: Session, url: URL) -> URL:
    try:
        db.add(url)
        db.commit()
        db.refresh(url)
        return url
    except IntegrityError:
        db.rollback()
        raise


def get_url_by_short_code(
    db: Session,
    short_code: str,
) -> URL | None:
    result = db.execute(
        select(URL).where(URL.short_code == short_code)
    )
    return result.scalar_one_or_none()


def get_urls_by_user_id(
    db: Session,
    user_id: int,
) -> list[URL]:
    result = db.execute(
        select(URL).where(URL.user_id == user_id)
    )
    return result.scalars().all()


def deactivate_url(db: Session, url: URL) -> URL:
    url.is_active = False

    db.commit()
    db.refresh(url)

    return url


def get_url_by_id(
    db: Session,
    url_id: int,
) -> URL | None:
    result = db.execute(
        select(URL).where(URL.id == url_id)
    )
    return result.scalar_one_or_none()