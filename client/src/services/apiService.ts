// API Service
import { ApiResponse } from '@/types/api';

class ApiService {
  private baseURL = '';

  constructor() {
    this.baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseURL}${url}`, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText || response.statusText}`);
    }

    return response.json();
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>('GET', url);
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('POST', url, data);
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('PUT', url, data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>('DELETE', url);
  }
}

export const apiService = new ApiService();
