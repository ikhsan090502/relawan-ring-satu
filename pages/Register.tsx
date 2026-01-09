
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: UserRole.WARGA
      });
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Daftar Warga</h1>
              <p className="text-slate-500 font-medium">Lengkapi data untuk mendapatkan layanan kesehatan cepat.</p>
            </div>
            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600">
              <span className="material-symbols-outlined text-4xl">person_add</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Nama Lengkap Sesuai KTP</label>
              <input 
                required
                type="text" 
                className="w-full h-14 px-5 bg-slate-50 border-slate-200 rounded-2xl font-bold focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="Contoh: Ahmad Subardjo"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full h-14 px-5 bg-slate-50 border-slate-200 rounded-2xl font-bold focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Nomor WhatsApp (Penting)</label>
                <input 
                  required
                  type="tel" 
                  className="w-full h-14 px-5 bg-slate-50 border-slate-200 rounded-2xl font-bold focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="0812xxxx"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Password</label>
              <input 
                required
                type="password" 
                className="w-full h-14 px-5 bg-slate-50 border-slate-200 rounded-2xl font-bold focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined">how_to_reg</span>
                    Daftar Akun Saya
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-10 text-sm text-slate-500">
            Sudah punya akun? <Link to="/login" className="font-black text-red-600 hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
