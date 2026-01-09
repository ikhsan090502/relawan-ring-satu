
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole, User } from '../types';
import { Chatbot } from './Chatbot';
import { WhatsAppButton } from './WhatsAppButton';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarLink: React.FC<{ to: string, icon: string, label: string, active: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <span className="material-symbols-outlined text-[22px]">{icon}</span>
    <span className="font-bold text-sm">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('081100001111');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }

    // Load WhatsApp number from localStorage
    const storedNumber = localStorage.getItem('adminWhatsappNumber');
    if (storedNumber) {
      setWhatsappNumber(storedNumber);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined text-2xl">ambulance</span>
          </div>
          <h1 className="font-black text-slate-900 tracking-tighter uppercase text-sm leading-none">Ring Satu<br/><span className="text-[10px] text-red-600 tracking-widest opacity-60">Health</span></h1>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-4">Menu Utama</p>
          <SidebarLink to="/dashboard" icon="dashboard" label="Dashboard" active={location.pathname === '/dashboard'} />

          {/* MENU KHUSUS WARGA */}
          {user.role === UserRole.WARGA && (
            <>
              <SidebarLink to="/create-report" icon="emergency" label="Panggil Ambulance" active={location.pathname === '/create-report'} />
              <SidebarLink to="/history" icon="history_edu" label="Riwayat Medis" active={location.pathname === '/history'} />
            </>
          )}

          {/* MENU KHUSUS ADMIN (Dispatcher) */}
          {user.role === UserRole.ADMIN && (
            <>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-8">Verifikasi</p>
              <SidebarLink to="/history" icon="pending_actions" label="Antrian Triase" active={location.pathname === '/history'} />
              <SidebarLink to="/manage-users" icon="group" label="Database Warga" active={location.pathname === '/manage-users'} />
              <SidebarLink to="/content-management" icon="settings_applications" label="Kelola Konten Sistem" active={location.pathname === '/content-management'} />
            </>
          )}

          {/* MENU KHUSUS RELAWAN (Tim Ambulance) */}
          {user.role === UserRole.RELAWAN && (
            <>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-8">Operasional</p>
              <SidebarLink to="/history" icon="assignment" label="Tugas Evakuasi" active={location.pathname === '/history'} />
            </>
          )}

          {/* MENU KHUSUS PIMPINAN (Monitor) */}
          {user.role === UserRole.PIMPINAN && (
            <>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-8">Monitoring</p>
              <SidebarLink to="/analytics" icon="analytics" label="Statistik Kesehatan" active={location.pathname === '/analytics'} />
            </>
          )}

          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-8">Lainnya</p>
          <SidebarLink to="/about" icon="info" label="Tentang Organisasi" active={location.pathname === '/about'} />
          <SidebarLink to="/settings" icon="settings" label="Pengaturan Profile" active={location.pathname === '/settings'} />
        </nav>

        <div className="p-6 border-t border-slate-100">
           <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
              {user.avatar && user.avatar !== '' ? (
                <img src={user.avatar} className="w-8 h-8 rounded-full border border-white shadow-sm" alt="Avatar" />
              ) : (
                <div className="w-8 h-8 rounded-full border border-white shadow-sm bg-slate-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{user.role}</p>
              </div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors">
             <span className="material-symbols-outlined text-lg">logout</span> Logout
           </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 z-20">
          <div className="flex-1 px-4">
             <div className="relative max-w-md hidden sm:block">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
               <input type="text" placeholder="Cari ID Medis, pasien, atau tim..." className="w-full bg-slate-100 border-none h-10 pl-10 pr-4 rounded-xl text-xs focus:ring-2 focus:ring-red-500/20 transition-all" />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors relative">
               <span className="material-symbols-outlined">notifications</span>
               <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wilayah Ring Satu</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-10">
          {children}
        </main>
      </div>

      {/* Chat functionality for Warga */}
      {user.role === UserRole.WARGA && (
        <>
          <WhatsAppButton phoneNumber={whatsappNumber} />
          <Chatbot />
        </>
      )}
    </div>
  );
};
