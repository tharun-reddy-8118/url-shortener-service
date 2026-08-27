from sqlalchemy.orm import Session
from app.db.models import URL, Click
from app.repositories.click_repository import create_click

def record_click(
    db: Session,
    url: URL,
    ip_address: str | None= None,
    user_agent: str | None= None,
    referrer: str | None= None,
) -> Click:
    click = Click(
        url_id=url.id,
        ip_address=ip_address,
        user_agent=user_agent,
        referrer=referrer,
    )
    return create_click(db, click)
