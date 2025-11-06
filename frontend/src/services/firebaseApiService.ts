import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getIdToken } from './firebaseAuthService';

class FirebaseApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add Firebase token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await getIdToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting Firebase token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - Firebase will handle this automatically
          console.error('Authentication error:', error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request<T>(config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Request failed');
    }
  }

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  // POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  // PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // PATCH request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  // User profile methods
  async getUserProfile() {
    return this.get('/api/firebase-auth/profile');
  }

  async updateUserProfile(data: any) {
    return this.put('/api/firebase-auth/profile', data);
  }

  async deleteUserAccount() {
    return this.delete('/api/firebase-auth/account');
  }

  async getUsers(params?: { search?: string; limit?: number }) {
    return this.get('/api/firebase-auth/users', { params });
  }

  async checkUsername(username: string) {
    return this.get(`/api/firebase-auth/check-username/${username}`);
  }
}

export const firebaseApiService = new FirebaseApiService();