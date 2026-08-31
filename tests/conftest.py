
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db


from app.main import app
from app.db import models

test_engine=create_engine(
    settings.test_database_url,
    pool_pre_ping=True
)

TestSessionLocal=sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine
)

def override_get_db():
    try:
        db=TestSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db]=override_get_db

@pytest.fixture(scope="session",autouse=True)
def setup_test_database():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def db_session():
    db = TestSessionLocal()

    try:
        yield db
    finally:
        db.close()