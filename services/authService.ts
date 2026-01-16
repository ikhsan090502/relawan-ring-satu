import ApiService from './apiService';
import { User } from '../types';

class AuthService {
  private currentUserCache: User | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async attemptLogin(email: string, password: string): Promise<User | null> {
    try {
      const data = await ApiService.post<{ token: string }>('/auth/login', { email, password });
      const token = data.token;
      if (token) {
        localStorage.setItem('auth_token', token);
        return await this.getCurrentUser();
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async register(userData: Partial<User> & { password: string }): Promise<User | null> {
    try {
      const data = await ApiService.post<{ token: string }>('/auth/register', userData);
      const token = data.token;
      if (token) {
        localStorage.setItem('auth_token', token);
        return await this.getCurrentUser();
      }
      return null;
    } catch (error) {
      console.error('Register error:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        this.currentUserCache = null;
        return null;
      }

      const now = Date.now();
      if (this.currentUserCache && now < this.cacheExpiry) {
        return this.currentUserCache;
      }

      const user = await ApiService.get<User>('/auth/profile');
      this.currentUserCache = user;
      this.cacheExpiry = now + this.CACHE_DURATION;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      this.currentUserCache = null;
      return null;
    }
  }

  async updateCurrentUser(user: User): Promise<void> {
    await ApiService.put('/auth/profile', user);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserCache = null;
    this.cacheExpiry = 0;
  }
}

export default new AuthService();
