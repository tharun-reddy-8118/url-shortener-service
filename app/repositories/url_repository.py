from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models import URL

def create_url(db:Session,url:URL)-> URL:
    try:
        db.add(url)
        db.commit()
        db.refresh(url)
        return url
    except IntegrityError:
            db.rollback()
            raise 

def get_url_by_short_code(db:Session,shortcode:str)->URL | None:
     result=db.execute(
          select(URL).where(URL.short_code==shortcode)
     )
     return result.scalar_one_or_none()

