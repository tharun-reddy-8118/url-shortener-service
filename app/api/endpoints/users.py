from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.core.exception import UserAlreadyExistsError
from app.db.models import User
from app.db.session import get_db
from app.services.user_service import get_users, create_user
from app.schemas.user import UserCreate,UserResponse


router = APIRouter(prefix="/users", tags=["users"])

@router.get("/count")
def user_count(db:Session=Depends(get_db)):
    users=get_users(db)
    return {
        "status": "ok",
        "user_count": len(users)
    }

@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user_endpoint(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        user = create_user(db, user_data)
        return user
    except UserAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
            )
@router.get("/me",response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user

