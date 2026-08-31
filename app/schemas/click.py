from pydantic import BaseModel,ConfigDict
from datetime import datetime

class ClickResponse(BaseModel):
    id: int
    url_id: int
    ip_address: str | None
    user_agent: str | None
    referrer: str | None
    clicked_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ClickCountResponse(BaseModel):
    url_id: int
    total_clicks: int