
import { User, UserRole } from '../types';
import { dbService } from './dbService';

const AUTH_KEY = 'rs_current_user';

export const authService = {
  login: (user: User) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },
  
  attemptLogin: (email: string, pass: string): { success: boolean, user?: User, message?: string } => {
    const users = dbService.getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      return { success: false, message: 'Email tidak ditemukan dalam sistem.' };
    }

    // Simulasi password (di sistem nyata gunakan hashing)
    if (pass.length < 6) {
      return { success: false, message: 'Password minimal 6 karakter.' };
    }

    authService.login(foundUser);
    return { success: true, user: foundUser };
  },

  register: (userData: Omit<User, 'id' | 'status' | 'avatar'>) => {
    const newUser: User = {
      ...userData,
      id: `WRG-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Aktif',
      avatar: ''
    };
    
    const users = dbService.getUsers();
    users.push(newUser);
    localStorage.setItem('rs_users', JSON.stringify(users));
    authService.login(newUser);
    return newUser;
  },

  // Fix: Added updateCurrentUser to persist profile changes in session and user database
  updateCurrentUser: (user: User) => {
    authService.login(user);
    const users = dbService.getUsers();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    localStorage.setItem('rs_users', JSON.stringify(updatedUsers));
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_KEY) !== null;
  }
};
