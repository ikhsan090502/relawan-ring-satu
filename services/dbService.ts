import ApiService from './apiService';
import { Report, User } from '../types';

class DbService {
  private reportsCache: Report[] = [];
  private reportsCacheExpiry: number = 0;
  private readonly CACHE_DURATION = 0; // Disable cache for real-time updates

  // Utility function to convert snake_case to camelCase
  private snakeToCamel(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this.snakeToCamel(item));

    const camelObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        camelObj[camelKey] = this.snakeToCamel(obj[key]);
      }
    }
    return camelObj;
  }

  async getReports(): Promise<Report[]> {
    try {
      const now = Date.now();
      if (this.reportsCache.length > 0 && now < this.reportsCacheExpiry) {
        return this.reportsCache;
      }

      const data = await ApiService.get<Report[] | { reports: Report[] }>('/reports');
      let reports: Report[] = [];
      if (Array.isArray(data)) {
        reports = data;
      } else if (data && Array.isArray(data.reports)) {
        reports = data.reports;
      }

      // Map snake_case to camelCase
      reports = reports.map(report => this.snakeToCamel(report) as Report);

      this.reportsCache = reports;
      this.reportsCacheExpiry = now + this.CACHE_DURATION;
      return reports;
    } catch (error) {
      console.error('Get reports error:', error);
      return [];
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const data = await ApiService.get<User[] | { users: User[] }>('/users');
      let users: User[] = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (data && Array.isArray(data.users)) {
        users = data.users;
      }

      // Map snake_case to camelCase
      users = users.map(user => this.snakeToCamel(user) as User);

      return users;
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const users = await this.getUsers();
    return users.filter(u => u.role === role);
  }

  async getReportById(id: string): Promise<Report | null> {
    const reports = await this.getReports();
    return reports.find(r => r.id === id) || null;
  }

  async updateReport(report: Report): Promise<void> {
    // Convert camelCase to snake_case for API
    const apiData: any = {
      status: report.status,
      urgency: report.urgency,
      admin_notes: report.adminNotes,
      assigned_volunteer_id: report.assignedVolunteerId,
      volunteer_report: report.volunteerReport
    };
    await ApiService.put(`/reports/${report.id}`, apiData);
    // Invalidate cache
    this.reportsCache = [];
    this.reportsCacheExpiry = 0;
  }

  async updateUserStatus(userId: string, status: string): Promise<void> {
    await ApiService.put(`/users/${userId}`, { status });
  }

  async createUser(userData: Partial<User> & { password: string }): Promise<User> {
    const response = await ApiService.post<{ user: User }>('/users', userData);
    return response.user;
  }

  async updateUser(user: User): Promise<User> {
    const response = await ApiService.put<{ user: User }>(`/users/${user.id}`, user);
    return response.user;
  }

  async deleteUser(userId: string): Promise<void> {
    await ApiService.delete(`/users/${userId}`);
  }

  async saveReport(report: Report): Promise<void> {
    await ApiService.post('/reports', report);
    // Invalidate cache
    this.reportsCache = [];
    this.reportsCacheExpiry = 0;
  }
}

export default new DbService();
