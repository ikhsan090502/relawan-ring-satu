// Placeholder API Service for MySQL Backend
// In production, replace with actual API calls to your backend

import { User, Report, UserRole } from '../types';

const API_BASE_URL = 'http://localhost:3001/api'; // Placeholder backend URL

export const apiService = {
  // User APIs
  async getUsers(): Promise<User[]> {
    // Placeholder - in real app, this would fetch from MySQL
    console.log('[API] GET /users');
    return new Promise(resolve => {
      setTimeout(() => {
        const data = localStorage.getItem('rs_users');
        resolve(data ? JSON.parse(data) : []);
      }, 500);
    });
  },

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    console.log('[API] POST /users', userData);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('rs_users') || '[]');
          const newUser = {
            ...userData,
            id: `${userData.role === UserRole.RELAWAN ? 'AMB' : 'ADM'}-${Date.now()}`
          };
          users.push(newUser);
          localStorage.setItem('rs_users', JSON.stringify(users));
          resolve(newUser);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    console.log('[API] PUT /users/${id}', userData);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('rs_users') || '[]');
          const index = users.findIndex((u: User) => u.id === id);
          if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            localStorage.setItem('rs_users', JSON.stringify(users));
            resolve(users[index]);
          } else {
            reject(new Error('User not found'));
          }
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  async deleteUser(id: string): Promise<void> {
    console.log('[API] DELETE /users/${id}');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('rs_users') || '[]');
          const filtered = users.filter((u: User) => u.id !== id);
          localStorage.setItem('rs_users', JSON.stringify(filtered));
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  // Report APIs
  async getReports(): Promise<Report[]> {
    console.log('[API] GET /reports');
    return new Promise(resolve => {
      setTimeout(() => {
        const data = localStorage.getItem('rs_reports');
        resolve(data ? JSON.parse(data) : []);
      }, 500);
    });
  },

  async createReport(reportData: Omit<Report, 'id'>): Promise<Report> {
    console.log('[API] POST /reports', reportData);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const reports = JSON.parse(localStorage.getItem('rs_reports') || '[]');
          const newReport = {
            ...reportData,
            id: `MED-${Date.now()}`
          };
          reports.push(newReport);
          localStorage.setItem('rs_reports', JSON.stringify(reports));
          resolve(newReport);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  async updateReport(id: string, reportData: Partial<Report>): Promise<Report> {
    console.log('[API] PUT /reports/${id}', reportData);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const reports = JSON.parse(localStorage.getItem('rs_reports') || '[]');
          const index = reports.findIndex((r: Report) => r.id === id);
          if (index !== -1) {
            reports[index] = { ...reports[index], ...reportData };
            localStorage.setItem('rs_reports', JSON.stringify(reports));
            resolve(reports[index]);
          } else {
            reject(new Error('Report not found'));
          }
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  // Authentication APIs
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    console.log('[API] POST /auth/login');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('rs_users') || '[]');
          const user = users.find((u: User) => u.email === email);
          if (user) {
            resolve({
              user,
              token: 'placeholder-jwt-token-' + Date.now()
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  async register(userData: Omit<User, 'id' | 'avatar'>): Promise<{ user: User; token: string }> {
    console.log('[API] POST /auth/register', userData);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('rs_users') || '[]');
          const existing = users.find((u: User) => u.email === userData.email);
          if (existing) {
            reject(new Error('Email already exists'));
            return;
          }

          const newUser = {
            ...userData,
            id: `WRG-${Date.now()}`,
            avatar: ''
          };
          users.push(newUser);
          localStorage.setItem('rs_users', JSON.stringify(users));

          resolve({
            user: newUser,
            token: 'placeholder-jwt-token-' + Date.now()
          });
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  // Notification APIs (placeholder)
  async sendWhatsAppNotification(phone: string, message: string): Promise<void> {
    console.log('[API] POST /notifications/whatsapp', { phone, message });
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`[WhatsApp API] Sending to ${phone}: ${message}`);
        resolve();
      }, 500);
    });
  },

  // Analytics APIs
  async getAnalytics(): Promise<any> {
    console.log('[API] GET /analytics');
    return new Promise(resolve => {
      setTimeout(() => {
        const reports = JSON.parse(localStorage.getItem('rs_reports') || '[]');
        const users = JSON.parse(localStorage.getItem('rs_users') || '[]');

        const analytics = {
          totalReports: reports.length,
          completedReports: reports.filter((r: Report) => r.status === 'Selesai/Pasien Diserahterimakan').length,
          activeVolunteers: users.filter((u: User) => u.role === UserRole.RELAWAN && u.status === 'Aktif').length,
          avgResponseTime: '02:15', // Placeholder
          survivalRate: '94.8%' // Placeholder
        };

        resolve(analytics);
      }, 500);
    });
  }
};