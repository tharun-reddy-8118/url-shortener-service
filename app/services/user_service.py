
from sqlalchemy.orm import Session
from app.core.exception import EmailAlreadyExistsError, UserAlreadyExistsError
from app.db.models import User
from app.repositories.user_repository import get_all_users
from app.schemas.user import UserCreate
from app.core.security import hash_password
from app.repositories.user_repository import create_user as create_user_repository, get_user_by_username, get_user_by_email


def get_users(db: Session)-> list[User]:

    return get_all_users(db)

def create_user(db: Session, user_data: UserCreate) -> User:
    if get_user_by_username(db, user_data.username):
        raise UserAlreadyExistsError("Username already exists")
    if get_user_by_email(db, user_data.email):
        raise EmailAlreadyExistsError("Email already exists")
    hashed_password = hash_password(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
    )

    return create_user_repository(db, user)