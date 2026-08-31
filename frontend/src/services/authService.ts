import api from './api';
import type { User, UserCreate, LoginRequest, TokenResponse } from '../types/api';

export const authService = {
  async register(data: UserCreate): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<TokenResponse> {
    // FastAPI requires form data for OAuth2 password bearer usually, but the instructions 
    // specify a JSON request: { "username": "string", "password": "string" } for /auth/login
    const response = await api.post<TokenResponse>('/auth/login', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
  
  logout() {
    localStorage.removeItem('access_token');
  },
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
  
  setToken(token: string) {
    localStorage.setItem('access_token', token);
  }
};
