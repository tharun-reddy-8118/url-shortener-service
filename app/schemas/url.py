from pydantic import BaseModel,HttpUrl, ConfigDict
from datetime import datetime


class URLCreate(BaseModel):
    original_url: HttpUrl

class URLResponse(BaseModel):
    id: int
    short_code: str
    original_url: HttpUrl
    is_active: bool
    expires_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
