export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface URL {
  id: number;
  user_id: number;
  short_code: string;
  original_url: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface URLCreate {
  original_url: string;
}

export interface Click {
  id: number;
  url_id: number;
  clicked_at: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
}

export interface ClickCountResponse {
  url_id: number;
  total_clicks: number;
}
