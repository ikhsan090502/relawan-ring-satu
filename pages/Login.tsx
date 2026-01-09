
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_DATABASE_USERS } from '../constants';
import { authService } from '../services/authService';
import { UserRole } from '../types';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Chatbot } from '../components/Chatbot';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('081100001111');

  useEffect(() => {
    const storedNumber = localStorage.getItem('adminWhatsappNumber');
    if (storedNumber) {
      setWhatsappNumber(storedNumber);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = authService.attemptLogin(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Kredensial salah.');
        setLoading(false);
      }
    }, 1000);
  };

  const quickLogin = (role: UserRole) => {
    const demo = MOCK_DATABASE_USERS.find(u => u.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword('password123');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Visual Branding Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative p-16 flex-col justify-between text-white">
        <div className="absolute inset-0 opacity-20 grayscale">
          <img src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Medical" />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">ambulance</span>
          </div>
          <span className="text-2xl font-black uppercase italic tracking-tighter">Relawan Ring Satu</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-6xl font-black tracking-tighter mb-6 leading-none">AKSES DARURAT MEDIS TERPADU.</h2>
          <p className="text-slate-400 font-medium text-lg">Sistem koordinasi ambulance wilayah untuk menjamin respon medis di bawah 15 menit.</p>
        </div>

        <div className="relative z-10 text-[10px] font-black uppercase tracking-[4px] text-slate-500">
          Emergency Command Center Platform © 2024
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 italic uppercase">Selamat Datang</h1>
            <p className="text-slate-500 font-medium">Masuk untuk mengelola laporan atau bantuan medis.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                <span className="material-symbols-outlined">warning</span> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Alamat Email</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">mail</span>
                  <input required type="email" placeholder="email@anda.com" className="w-full h-16 pl-14 pr-6 bg-slate-50 border-none rounded-3xl font-bold focus:ring-2 focus:ring-red-500/20 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock</span>
                  <input required type="password" placeholder="••••••••" className="w-full h-16 pl-14 pr-6 bg-slate-50 border-none rounded-3xl font-bold focus:ring-2 focus:ring-red-500/20 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full h-16 bg-red-600 text-white rounded-[2rem] font-black shadow-2xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-3">
              {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <><span className="material-symbols-outlined">login</span> MASUK SISTEM</>}
            </button>
          </form>


          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-slate-500">Warga belum terdaftar?</p>
            <Link to="/register" className="inline-block mt-2 text-red-600 font-black text-lg border-b-2 border-red-100 hover:border-red-600 transition-all tracking-tight uppercase">
              Daftar Sekarang &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Chatbot and WhatsApp */}
      <Chatbot />
      <WhatsAppButton phoneNumber={whatsappNumber} />
    </div>
  );
};
