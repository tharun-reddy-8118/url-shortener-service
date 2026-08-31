def test_app_starts(client):
    response = client.get("/docs")

    assert response.status_code == 200

def test_create_user(client):
    response=client.post(
        "/users",
        json={
            "username":"testuser",
            "email":"test@example.com",
            "password":"testpassword123"
        }
    )
    assert response.status_code==201

    data=response.json()

    assert data["username"]=="testuser"
    assert data["email"]=="test@example.com"
    assert data["is_active"] is True
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data
    assert "password" not in data
    assert "hashed_password" not in data

def test_duplicate_username(client):
    user = {
        "username": "duplicateuser",
        "email": "first@example.com",
        "password": "testpassword123",
    }

    response = client.post("/users", json=user)
    assert response.status_code == 201

    duplicate = {
        "username": "duplicateuser",
        "email": "second@example.com",
        "password": "testpassword123",
    }

    response = client.post("/users", json=duplicate)

    assert response.status_code == 409
    assert response.json()["detail"] == "Username already exists"

def test_duplicate_email(client):
    user = {
        "username": "userone",
        "email": "same@example.com",
        "password": "testpassword123",
    }

    response = client.post("/users", json=user)
    assert response.status_code == 201

    duplicate = {
        "username": "usertwo",
        "email": "same@example.com",
        "password": "testpassword123",
    }

    response = client.post("/users", json=duplicate)

    assert response.status_code == 409
    assert response.json()["detail"] == "Email already exists"


def test_login_success(client):
    # Create user
    client.post(
        "/users",
        json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "testpassword123",
        },
    )

    # Login
    response = client.post(
        "/auth/login",
        json={
            "username": "loginuser",
            "password": "testpassword123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert len(data["access_token"]) > 0

def test_login_wrong_password(client):
    client.post(
        "/users",
        json={
            "username": "wrongpassuser",
            "email": "wrongpass@example.com",
            "password": "correctpassword123",
        },
    )

    response = client.post(
        "/auth/login",
        json={
            "username": "wrongpassuser",
            "password": "wrongpassword123",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"

def test_login_nonexistent_user(client):
    response = client.post(
        "/auth/login",
        json={
            "username": "doesnotexist",
            "password": "somepassword123",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"

def test_get_current_user(client):
    # Create user
    client.post(
        "/users",
        json={
            "username": "meuser",
            "email": "me@example.com",
            "password": "testpassword123",
        },
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "username": "meuser",
            "password": "testpassword123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    # Access protected endpoint
    response = client.get(
        "/users/me",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["username"] == "meuser"
    assert data["email"] == "me@example.com"

def test_get_current_user_without_token(client):
    response = client.get("/users/me")

    assert response.status_code == 401
