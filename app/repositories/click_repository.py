from sqlalchemy.orm import Session
from app.db.models import Click
from sqlalchemy.exc import IntegrityError


def create_click(db:Session, click:Click)-> Click:
    try:
        db.add(click)
        db.commit()
        db.refresh(click)
        return click
    except IntegrityError:
            db.rollback()
            raise