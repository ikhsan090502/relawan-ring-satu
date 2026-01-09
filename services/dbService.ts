
import { User, UserRole, Report } from '../types';
import { apiService } from './apiService';

export const dbService = {
  // Inisialisasi Database - tidak diperlukan lagi karena menggunakan API
  init: (mockUsers: User[], mockReports: Report[]) => {
    // No longer needed - data comes from API
    console.log('Database service initialized with API backend');
  },

  // Operasi User
  async getUsers(): Promise<User[]> {
    try {
      return await apiService.users.getAll();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  },

  async getUsersByRole(role: UserRole): Promise<User[]> {
    const users = await dbService.getUsers();
    return users.filter(u => u.role === role);
  },

  async updateUserStatus(userId: string, status: 'Aktif' | 'Nonaktif'): Promise<void> {
    try {
      await apiService.users.update(userId, { status });
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error;
    }
  },

  // Operasi Laporan
  async getReports(): Promise<Report[]> {
    try {
      return await apiService.reports.getAll();
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      return [];
    }
  },

  async getReportById(id: string): Promise<Report | undefined> {
    try {
      return await apiService.reports.getById(id);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      return undefined;
    }
  },

  async saveReport(report: Report): Promise<void> {
    try {
      await apiService.reports.create(report);
    } catch (error) {
      console.error('Failed to save report:', error);
      throw error;
    }
  },

  async updateReport(updatedReport: Report): Promise<void> {
    try {
      await apiService.reports.update(updatedReport.id, updatedReport);
    } catch (error) {
      console.error('Failed to update report:', error);
      throw error;
    }
  }
};
