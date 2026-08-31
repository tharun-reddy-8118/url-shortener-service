from sqlalchemy.orm import Session
from app.db.models import Click
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select,func


def create_click(db:Session, click:Click)-> Click:
    try:
        db.add(click)
        db.commit()
        db.refresh(click)
        return click
    except IntegrityError:
            db.rollback()
            raise
def get_click_count(db: Session, url_id: int) -> int:
    result= db.execute(
        select(func.count())
        .select_from(Click)
        .where(Click.url_id==url_id)
    ) 
    return result.scalar_one()

def get_clicks_by_url_id(db:Session,url_id:int)->list[Click]:
    result=db.execute(
        select(Click).where(Click.url_id==url_id).order_by(Click.clicked_at.desc())
    )
    return result.scalars().all()