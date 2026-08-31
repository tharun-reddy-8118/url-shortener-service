from datetime import datetime, timedelta, timezone

from app.db.models import URL
def test_create_url(client):
    # Create user
    client.post(
        "/users",
        json={
            "username": "urluser",
            "email": "url@example.com",
            "password": "testpassword123",
        },
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "username": "urluser",
            "password": "testpassword123",
        },
    )

    token = login_response.json()["access_token"]

    # Create short URL
    response = client.post(
        "/urls",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "original_url": "https://www.google.com",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["original_url"] == "https://www.google.com/"
    assert data["short_code"]

def test_create_url_without_token(client):
    response = client.post(
        "/urls",
        json={
            "original_url": "https://www.google.com",
        },
    )

    assert response.status_code == 401

def test_redirect_and_record_click(client):
    # Create user
    client.post(
        "/users",
        json={
            "username": "redirectuser",
            "email": "redirect@example.com",
            "password": "testpassword123",
        },
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "username": "redirectuser",
            "password": "testpassword123",
        },
    )

    token = login_response.json()["access_token"]

    # Create URL
    create_response = client.post(
        "/urls",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "original_url": "https://example.com",
        },
    )

    assert create_response.status_code == 201

    data = create_response.json()
    short_code = data["short_code"]

    # Redirect
    response = client.get(
        f"/urls/{short_code}",
        follow_redirects=False,
        headers={
            "User-Agent": "pytest-test-agent",
            "Referer": "https://google.com",
        },
    )

    assert response.status_code == 307
    assert response.headers["location"] == "https://example.com/"

def test_click_history(client):
    # Create user
    client.post(
        "/users",
        json={
            "username": "historyuser",
            "email": "history@example.com",
            "password": "testpassword123",
        },
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "username": "historyuser",
            "password": "testpassword123",
        },
    )

    token = login_response.json()["access_token"]

    # Create URL
    create_response = client.post(
        "/urls",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "original_url": "https://example.com",
        },
    )

    assert create_response.status_code == 201

    data = create_response.json()
    url_id = data["id"]
    short_code = data["short_code"]

    # Generate a click
    response = client.get(
        f"/urls/{short_code}",
        follow_redirects=False,
        headers={
            "User-Agent": "pytest-test-agent",
            "Referer": "https://google.com",
        },
    )

    assert response.status_code == 307

    # Get click history
    history_response = client.get(
        f"/urls/{url_id}/clicks/history",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert history_response.status_code == 200

    history = history_response.json()

    assert len(history) == 1
    assert history[0]["url_id"] == url_id
    assert history[0]["user_agent"] == "pytest-test-agent"
    assert history[0]["referrer"] == "https://google.com"



def test_expired_url(client, db_session):
    # Create user
    client.post(
        "/users",
        json={
            "username": "expireduser",
            "email": "expired@example.com",
            "password": "testpassword123",
        },
    )

    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "username": "expireduser",
            "password": "testpassword123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    # Create URL
    create_response = client.post(
        "/urls",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "original_url": "https://example.com",
        },
    )

    assert create_response.status_code == 201

    data = create_response.json()
    short_code = data["short_code"]

    # Make URL expired
    url = db_session.query(URL).filter(
        URL.short_code == short_code
    ).first()

    assert url is not None

    url.expires_at = (
        datetime.now(timezone.utc) - timedelta(minutes=1)
    )

    db_session.commit()

    # Access expired URL
    response = client.get(
        f"/urls/{short_code}",
        follow_redirects=False,
    )

    assert response.status_code == 410
    assert response.json()["detail"] == "URL has expired"

def test_inactive_url(client, db_session):
    client.post(
        "/users",
        json={
            "username": "inactiveuser",
            "email": "inactive@example.com",
            "password": "testpassword123",
        },
    )

    login_response = client.post(
        "/auth/login",
        json={
            "username": "inactiveuser",
            "password": "testpassword123",
        },
    )

    token = login_response.json()["access_token"]

    create_response = client.post(
        "/urls",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "original_url": "https://example.com",
        },
    )

    assert create_response.status_code == 201

    data = create_response.json()
    short_code = data["short_code"]

    url = db_session.query(URL).filter(
        URL.short_code == short_code
    ).first()

    assert url is not None

    url.is_active = False
    db_session.commit()

    response = client.get(
        f"/urls/{short_code}",
        follow_redirects=False,
    )

    assert response.status_code == 410
    assert response.json()["detail"] == "URL is inactive"

def test_user_cannot_access_other_users_clicks(client):
    # Create User A
    client.post(
        "/users",
        json={
            "username": "usera",
            "email": "usera@example.com",
            "password": "password123",
        },
    )

    login_a = client.post(
        "/auth/login",
        json={
            "username": "usera",
            "password": "password123",
        },
    )

    token_a = login_a.json()["access_token"]

    # User A creates URL
    create_response = client.post(
        "/urls",
        headers={
            "Authorization": f"Bearer {token_a}",
        },
        json={
            "original_url": "https://example.com",
        },
    )

    assert create_response.status_code == 201

    url_id = create_response.json()["id"]

    # Create User B
    client.post(
        "/users",
        json={
            "username": "userb",
            "email": "userb@example.com",
            "password": "password123",
        },
    )

    login_b = client.post(
        "/auth/login",
        json={
            "username": "userb",
            "password": "password123",
        },
    )

    token_b = login_b.json()["access_token"]

    # User B tries to access User A's clicks
    response = client.get(
        f"/urls/{url_id}/clicks",
        headers={
            "Authorization": f"Bearer {token_b}",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "URL not found"

def test_user_cannot_deactivate_other_users_url(client):
    # Create User A
    client.post(
        "/users",
        json={
            "username": "deactivatea",
            "email": "deactivatea@example.com",
            "password": "password123",
        },
    )

    login_a = client.post(
        "/auth/login",
        json={
            "username": "deactivatea",
            "password": "password123",
        },
    )

    token_a = login_a.json()["access_token"]

    # User A creates URL
    create_response = client.post(
        "/urls",
        headers={
            "Authorization": f"Bearer {token_a}",
        },
        json={
            "original_url": "https://example.com",
        },
    )

    assert create_response.status_code == 201

    url_id = create_response.json()["id"]

    # Create User B
    client.post(
        "/users",
        json={
            "username": "deactivateb",
            "email": "deactivateb@example.com",
            "password": "password123",
        },
    )

    login_b = client.post(
        "/auth/login",
        json={
            "username": "deactivateb",
            "password": "password123",
        },
    )

    token_b = login_b.json()["access_token"]

    # User B tries to deactivate User A's URL
    response = client.patch(
        f"/urls/{url_id}/deactivate",
        headers={
            "Authorization": f"Bearer {token_b}",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "URL not found"

def test_url_not_found(client):
    response = client.get(
        "/urls/doesnotexist",
        follow_redirects=False,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "URL not found"

def test_click_count_zero(client):
    client.post(
        "/users",
        json={
            "username": "zeroclickuser",
            "email": "zeroclick@example.com",
            "password": "password123",
        },
    )

    login_response = client.post(
        "/auth/login",
        json={
            "username": "zeroclickuser",
            "password": "password123",
        },
    )

    token = login_response.json()["access_token"]

    create_response = client.post(
        "/urls",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "original_url": "https://example.com",
        },
    )

    assert create_response.status_code == 201

    url_id = create_response.json()["id"]

    response = client.get(
        f"/urls/{url_id}/clicks",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200
    assert response.json()["url_id"] == url_id
    assert response.json()["total_clicks"] == 0