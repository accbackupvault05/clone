import { apiService } from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/api/auth/login', credentials);
    
    if (response.success && response.data) {
      const { tokens } = response.data;
      apiService.setAuthTokens(tokens.accessToken, tokens.refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/api/auth/register', userData);
    
    if (response.success && response.data) {
      const { tokens } = response.data;
      apiService.setAuthTokens(tokens.accessToken, tokens.refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/api/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.error('Logout error:', error);
    } finally {
      apiService.clearAuthTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<{ user: User }>('/api/auth/me');
    
    if (response.success && response.data) {
      return response.data.user;
    }
    
    throw new Error(response.message || 'Failed to get user data');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiService.put('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  }

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<{ tokens: { accessToken: string; refreshToken: string } }>(
      '/api/auth/refresh',
      { refreshToken }
    );
    
    if (response.success && response.data) {
      const { tokens } = response.data;
      apiService.setAuthTokens(tokens.accessToken, tokens.refreshToken);
      return tokens;
    }
    
    throw new Error(response.message || 'Token refresh failed');
  }

  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  }
}

export const authService = new AuthService();
export default authService;