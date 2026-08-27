from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text ,  Boolean ,DateTime, ForeignKey,func
from app.db.base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime]= mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    urls: Mapped[list["URL"]] = relationship("URL", back_populates="owner")

class URL(Base):
    __tablename__="urls"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False,index=True)
    short_code: Mapped[str] = mapped_column(String(16), unique=True, nullable=False)
    original_url: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True,nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    owner: Mapped["User"] = relationship("User", back_populates="urls")
    clicks: Mapped[list["Click"]] = relationship("Click", back_populates="url")


class Click(Base):
    __tablename__="clicks"

    id: Mapped[int] = mapped_column(primary_key=True)
    url_id: Mapped[int] = mapped_column(ForeignKey("urls.id"), nullable=False,index=True)
    clicked_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(),nullable=False)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str] = mapped_column(Text, nullable=True)
    referrer: Mapped[str] = mapped_column(Text, nullable=True)
    url: Mapped["URL"] = relationship("URL", back_populates="clicks")
