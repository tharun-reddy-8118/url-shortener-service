import api from './api';
import type { URL, URLCreate, ClickCountResponse, Click } from '../types/api';

export const urlService = {
  async createUrl(data: URLCreate): Promise<URL> {
    const response = await api.post<URL>('/urls', data);
    return response.data;
  },

  async getMyUrls(): Promise<URL[]> {
    const response = await api.get<URL[]>('/urls');
    return response.data;
  },

  async activateUrl(id: number): Promise<URL> {
    const response = await api.patch<URL>(`/urls/${id}/activate`);
    return response.data;
  },

  async deactivateUrl(id: number): Promise<URL> {
    const response = await api.patch<URL>(`/urls/${id}/deactivate`);
    return response.data;
  },

  async getClickCount(id: number): Promise<ClickCountResponse> {
    const response = await api.get<ClickCountResponse>(`/urls/${id}/clicks`);
    return response.data;
  },

  async getClickHistory(id: number): Promise<Click[]> {
    const response = await api.get<Click[]>(`/urls/${id}/clicks/history`);
    return response.data;
  }
};
