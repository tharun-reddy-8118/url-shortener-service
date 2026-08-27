from app.core.exception import InvalidCredentialsError
from app.repositories.user_repository import get_user_by_username
from app.core.security import verify_password, create_access_token
from app.schemas import user
from app.schemas.auth import LoginRequest
from sqlalchemy.orm import Session

def login_user(db:Session,login_data:LoginRequest)->str:
    user=get_user_by_username(db,login_data.username)
    if not user:
        raise InvalidCredentialsError("Invalid username or password")
    if not verify_password(login_data.password,user.hashed_password):
        raise InvalidCredentialsError("Invalid username or password")
    access_token=create_access_token({"sub":str(user.id)})
    return access_token