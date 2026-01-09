// API service for handling HTTP requests to backend
import { User, Report } from '../types';

export const apiService = {
  // Base API URL - configurable via environment
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api',

  // Helper method for making requests
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  // Authentication methods
  auth: {
    async login(email: string, password: string) {
      const response = await apiService.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // Store token
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      return response;
    },

    async register(userData: any) {
      const response = await apiService.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      // Store token
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      return response;
    },

    async getProfile() {
      return apiService.request('/auth/profile');
    },

    async updateProfile(profileData: any) {
      return apiService.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },

    logout() {
      localStorage.removeItem('auth_token');
    },
  },

  // User management
  users: {
    async getAll() {
      const response = await apiService.request('/users');
      return response.users;
    },

    async getById(id: string) {
      const response = await apiService.request(`/users/${id}`);
      return response.user;
    },

    async create(userData: any) {
      const response = await apiService.request('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response.user;
    },

    async update(id: string, userData: any) {
      const response = await apiService.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response.user;
    },

    async delete(id: string) {
      return apiService.request(`/users/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Reports management
  reports: {
    async getAll() {
      const response = await apiService.request('/reports');
      return response.reports;
    },

    async getById(id: string) {
      const response = await apiService.request(`/reports/${id}`);
      return response.report;
    },

    async create(reportData: any) {
      const response = await apiService.request('/reports', {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
      return response.report;
    },

    async update(id: string, reportData: any) {
      const response = await apiService.request(`/reports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reportData),
      });
      return response.report;
    },

    async delete(id: string) {
      return apiService.request(`/reports/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Analytics (placeholder - would need backend implementation)
  async getAnalytics() {
    // For now, return mock data - in production this would call backend
    return {
      totalReports: 0,
      completedReports: 0,
      activeVolunteers: 0,
      avgResponseTime: '02:15',
      survivalRate: '94.8%'
    };
  },

  // WhatsApp notifications (placeholder)
  async sendWhatsAppNotification(phone: string, message: string) {
    console.log(`[WhatsApp] Sending to ${phone}: ${message}`);
    // In production, this would call WhatsApp API
    return Promise.resolve();
  },
};