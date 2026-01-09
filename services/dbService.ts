
import { User, UserRole, Report } from '../types';

const DB_KEYS = {
  USERS: 'rs_users',
  REPORTS: 'rs_reports'
};

export const dbService = {
  // Inisialisasi Database dengan data awal jika kosong
  init: (mockUsers: User[], mockReports: Report[]) => {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem(DB_KEYS.REPORTS)) {
      localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(mockReports));
    }
  },

  // Operasi User
  getUsers: (): User[] => {
    const data = localStorage.getItem(DB_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getUsersByRole: (role: UserRole): User[] => {
    return dbService.getUsers().filter(u => u.role === role);
  },

  updateUserStatus: (userId: string, status: 'Aktif' | 'Nonaktif') => {
    const users = dbService.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, status } : u);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(updated));
  },

  // Operasi Laporan
  getReports: (): Report[] => {
    const data = localStorage.getItem(DB_KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  },

  getReportById: (id: string): Report | undefined => {
    const reports = dbService.getReports();
    return reports.find(r => r.id === id);
  },

  saveReport: (report: Report) => {
    const reports = dbService.getReports();
    reports.unshift(report);
    localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(reports));
    window.dispatchEvent(new Event('storage'));
  },

  updateReport: (updatedReport: Report) => {
    const reports = dbService.getReports();
    const index = reports.findIndex(r => r.id === updatedReport.id);
    if (index !== -1) {
      reports[index] = updatedReport;
      localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(reports));
      window.dispatchEvent(new Event('storage'));
    }
  }
};
