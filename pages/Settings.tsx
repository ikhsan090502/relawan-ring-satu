
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { authService } from '../services/authService';
import { User } from '../types';

export const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
      setPhone(current.phone);
      setAvatarPreview(current.avatar);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (user) {
      const updated = { ...user, phone, avatar: avatarPreview };
      authService.updateCurrentUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Pengaturan Profil</h1>
          <p className="text-slate-500 font-medium">Kelola informasi akun dan preferensi notifikasi Anda.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <section className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
             <div className="flex items-center gap-6 mb-10">
                <div className="relative">
                  {avatarPreview || (user.avatar && user.avatar !== '') ? (
                    <img src={avatarPreview || user.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-xl" alt="Profile" />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400 text-3xl">person</span>
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-red-600 text-white rounded-full p-2 cursor-pointer hover:bg-red-700 transition-all">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900 leading-none">{user.name}</h2>
                   <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">{user.role}</p>
                </div>
             </div>

             <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Nomor WhatsApp untuk Notifikasi</label>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-green-500">chat</span>
                      <input 
                        type="tel" 
                        className="w-full h-14 pl-12 pr-5 bg-slate-50 border-slate-200 rounded-2xl font-bold focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="0812xxxx"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={handleSave}
                      className="bg-slate-900 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                      Update
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-400 font-medium italic">
                    *Nomor ini akan digunakan oleh sistem untuk mengirimkan notifikasi real-time pergerakan ambulance melalui WhatsApp bot.
                  </p>
                </div>

                {saved && (
                  <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 animate-bounce">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="text-xs font-black uppercase tracking-widest">Nomor Berhasil Diperbarui</span>
                  </div>
                )}
             </div>
          </section>

          <section className="bg-slate-900 rounded-[3rem] p-10 text-white">
             <h3 className="text-xs font-black uppercase tracking-[3px] mb-6 flex items-center gap-3">
               <span className="material-symbols-outlined text-red-500">notifications_active</span>
               Preferensi Notifikasi Bot
             </h3>
             <div className="space-y-4">
                {[
                  { title: 'Status Laporan Diterima', desc: 'Kirim WA saat admin memverifikasi laporan.' },
                  { title: 'Status Pergerakan Ambulance', desc: 'Kirim WA saat tim menuju lokasi dan menuju RS.' },
                  { title: 'Pesan Dari Tim Medis', desc: 'Kirim WA jika tim medis butuh info tambahan.' }
                ].map(n => (
                  <div key={n.title} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm font-black">{n.title}</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{n.desc}</p>
                    </div>
                    <div className="w-12 h-6 bg-red-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};
