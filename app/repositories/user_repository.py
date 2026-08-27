
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models import User
from sqlalchemy.exc import IntegrityError

def get_all_users(db: Session)-> list[User]:
    result=db.execute(
        select(User)
    )
    users=result.scalars().all()
    return users

def create_user(db:Session,user:User)-> User:
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise 

def get_user_by_username(db: Session, username: str) -> User | None:

    result = db.execute(
        select(User).where(User.username == username)
    )

    return result.scalar_one_or_none()

def get_user_by_email(db: Session, email: str) -> User | None:
    result = db.execute(
        select(User).where(User.email == email)
    )

    return result.scalar_one_or_none()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    result = db.execute(
        select(User).where(User.id == user_id)
    )

    return result.scalar_one_or_none()