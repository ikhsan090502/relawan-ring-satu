
import { User, UserRole } from '../types';
import { apiService } from './apiService';

const AUTH_KEY = 'rs_current_user';

export const authService = {
  async attemptLogin(email: string, password: string): Promise<{ success: boolean, user?: User, message?: string }> {
    try {
      const response = await apiService.auth.login(email, password);
      // Store user data locally for quick access
      localStorage.setItem(AUTH_KEY, JSON.stringify(response.user));
      return { success: true, user: response.user };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login gagal' };
    }
  },

  async register(userData: Omit<User, 'id' | 'status' | 'avatar'>): Promise<User> {
    try {
      const response = await apiService.auth.register(userData);
      // Store user data locally
      localStorage.setItem(AUTH_KEY, JSON.stringify(response.user));
      return response.user;
    } catch (error: any) {
      throw new Error(error.message || 'Registrasi gagal');
    }
  },

  async updateCurrentUser(user: User): Promise<void> {
    try {
      await apiService.auth.updateProfile(user);
      // Update local storage
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.message || 'Update profile gagal');
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    apiService.auth.logout();
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_KEY) !== null && localStorage.getItem('auth_token') !== null;
  }
};
