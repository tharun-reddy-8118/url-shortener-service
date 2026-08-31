from sqlalchemy.orm import Session

from app.core.exception import InvalidCredentialsError
from app.core.security import create_access_token, verify_password
from app.repositories.user_repository import get_user_by_username
from app.schemas.auth import LoginRequest


def login_user(db: Session, login_data: LoginRequest) -> str:
    user = get_user_by_username(db, login_data.username)

    if not user:
        raise InvalidCredentialsError("Invalid username or password")

    if not verify_password(login_data.password, user.hashed_password):
        raise InvalidCredentialsError("Invalid username or password")

    access_token = create_access_token({"sub": str(user.id)})

    return access_token