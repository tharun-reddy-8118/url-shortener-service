from sqlalchemy.orm import Session
from app.db.models import URL, User
from app.repositories.url_repository import create_url, get_url_by_short_code
from app.schemas.url import URLCreate
import secrets
import string


def generate_short_code(length: int = 7) -> str:


    characters = string.ascii_letters + string.digits
    short_code = ''.join(secrets.choice(characters) for _ in range(length))
    return short_code

def create_short_url(db: Session, url_data: URLCreate,current_user: User,) -> URL:
    
    for attempt in range(5):
        short_code = generate_short_code()  # Try up to 5 times to generate a unique short code
        if not get_url_by_short_code(db, short_code):
            break
    else:
        raise Exception("Could not generate a unique short code")


    url = URL(
        original_url=str(url_data.original_url),
        short_code=short_code,
        user_id=current_user.id
    )
    return create_url(db, url)