
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { dbService } from '../services/dbService';
import { UserRole, User, ReportStatus, Report } from '../types';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    merah: 0,
    kuning: 0,
    total: 0,
    selesai: 0
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    const allReports = dbService.getReports();
    setReports(allReports);
    
    setStats({
      merah: allReports.filter(r => r.urgency.includes('Merah')).length,
      kuning: allReports.filter(r => r.urgency.includes('Kuning')).length,
      total: allReports.length,
      selesai: allReports.filter(r => r.status === ReportStatus.SELESAI).length
    });
  }, []);

  if (!user) return null;

  // 1. LAYOUT UNTUK WARGA
  const WargaDashboard = () => (
    <div className="space-y-8">
      <div className="bg-red-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tighter italic mb-4">Butuh Ambulance Segera?</h1>
          <p className="text-red-100 text-lg font-medium max-w-lg mb-8">Tekan tombol di bawah untuk memanggil bantuan medis. Tim dispatcher kami siaga 24 jam untuk membantu Anda.</p>
          <button 
            onClick={() => navigate('/create-report')}
            className="bg-white text-red-600 px-10 py-6 rounded-3xl font-black shadow-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 text-xl uppercase tracking-tighter"
          >
            <span className="material-symbols-outlined text-4xl">emergency_share</span>
            PANGGIL SEKARANG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600">history</span> Laporan Terakhir Anda
          </h3>
          {reports.filter(r => r.reporterName === user.name).length > 0 ? (
            <div className="space-y-4">
              {reports.filter(r => r.reporterName === user.name).slice(0, 1).map(r => (
                <div key={r.id} onClick={() => navigate(`/report/${r.id}`)} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:border-red-500 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600 px-3 py-1 bg-red-50 rounded-full">{r.status}</span>
                    <span className="text-[10px] font-bold text-slate-400">{r.eventDate}</span>
                  </div>
                  <p className="font-black text-slate-900 uppercase italic leading-none mb-1">{r.patientName}</p>
                  <p className="text-xs text-slate-500 font-medium">{r.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Belum ada riwayat laporan medis.</p>
          )}
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
          <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6">Pusat Bantuan Cepat</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="tel:119" className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-red-500 mb-2">call</span>
              <span className="text-[10px] font-black uppercase">Call Center 119</span>
            </a>
            <button onClick={() => navigate('/p3k-guide')} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-blue-400 mb-2">medical_information</span>
              <span className="text-[10px] font-black uppercase">Panduan P3K</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 2. LAYOUT UNTUK ADMIN (DISPATCHER)
  const AdminDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Perlu Triase', val: reports.filter(r => r.status === ReportStatus.MENUNGGU).length, color: 'bg-red-600', icon: 'pending_actions' },
          { label: 'Dalam Penanganan', val: reports.filter(r => r.status !== ReportStatus.SELESAI && r.status !== ReportStatus.MENUNGGU).length, color: 'bg-orange-500', icon: 'ambulance' },
          { label: 'Tim Standby', val: '04', color: 'bg-green-500', icon: 'verified_user' },
          { label: 'Kasus Hari Ini', val: reports.length, color: 'bg-slate-800', icon: 'event_note' }
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 ${s.color} text-white rounded-xl flex items-center justify-center mb-4`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600">notification_important</span> Antrian Laporan Masuk
          </h2>
          <button onClick={() => navigate('/history')} className="text-[10px] font-black text-red-600 uppercase">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100">
              {reports.filter(r => r.status === ReportStatus.MENUNGGU).map(r => (
                <tr key={r.id} onClick={() => navigate(`/report/${r.id}`)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900 leading-none mb-1">{r.id}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{r.patientName}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${r.urgency.includes('Merah') ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      {r.urgency}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-500 font-medium truncate max-w-xs">{r.location}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Proses Sekarang</button>
                  </td>
                </tr>
              ))}
              {reports.filter(r => r.status === ReportStatus.MENUNGGU).length === 0 && (
                <tr><td className="p-12 text-center text-slate-400 italic">Tidak ada antrian laporan baru.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 3. LAYOUT UNTUK TIM MEDIS (RELAWAN)
  const RelawanDashboard = () => {
    const activeTasks = reports.filter(r => r.assignedVolunteerId === user.id && r.status !== ReportStatus.SELESAI);
    
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Status Tugas Lapangan</h2>
           <div className="flex bg-white p-1 rounded-xl border border-slate-200">
             <span className="px-4 py-2 bg-green-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">On Duty</span>
           </div>
        </div>

        {activeTasks.length > 0 ? (
          <div className="bg-red-600 rounded-[3rem] p-10 text-white shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[3px] text-red-200 mb-4">Tugas Aktif Saat Ini</p>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-1">{activeTasks[0].id}</h3>
                <p className="text-xl font-bold">{activeTasks[0].patientName} • {activeTasks[0].patientAge}th</p>
                <p className="text-sm text-red-100 mt-2 italic">"{activeTasks[0].description}"</p>
              </div>
              <button 
                onClick={() => navigate(`/report/${activeTasks[0].id}`)}
                className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                Update Progress & Navigasi
              </button>
            </div>
            <div className="mt-8 pt-8 border-t border-red-500/50 grid grid-cols-2 md:grid-cols-4 gap-4">
               <div>
                  <p className="text-[9px] font-black text-red-200 uppercase mb-1">Status</p>
                  <p className="text-xs font-black uppercase">{activeTasks[0].status}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-red-200 uppercase mb-1">Urgensi</p>
                  <p className="text-xs font-black uppercase">{activeTasks[0].urgency}</p>
               </div>
               <div className="col-span-2">
                  <p className="text-[9px] font-black text-red-200 uppercase mb-1">Lokasi</p>
                  <p className="text-xs font-black uppercase truncate">{activeTasks[0].location}</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[3rem] border border-dashed border-slate-300 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-slate-300">bedtime</span>
             </div>
             <h3 className="text-xl font-black text-slate-400 uppercase italic">Belum Ada Tugas Ditugaskan</h3>
             <p className="text-sm text-slate-400 mt-2 font-medium">Tetap siaga dan pastikan GPS Anda dalam kondisi menyala.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Peralatan & Kesiapan</h3>
             <div className="space-y-4">
                {['Oksigen Sentral', 'Defibrillator', 'Obat Emergensi', 'Bahan Medis Habis Pakai'].map(tool => (
                  <div key={tool} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-bold text-slate-700">{tool}</span>
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                  </div>
                ))}
             </div>
           </div>
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Statistik Tim Anda</h3>
             <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white/5 rounded-2xl">
                   <p className="text-2xl font-black">{reports.filter(r => r.assignedVolunteerId === user.id && r.status === ReportStatus.SELESAI).length}</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase">Evakuasi Selesai</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                   <p className="text-2xl font-black">08m</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase">Avg Response Time</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    );
  };

  // 4. LAYOUT UNTUK PIMPINAN (MONITORING)
  const PimpinanDashboard = () => (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900">Health Monitor Hub</h1>
            <p className="text-slate-500 font-medium">Laporan analitik performa pelayanan kesehatan wilayah Ring Satu.</p>
         </div>
         <div className="flex gap-3">
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span> PDF Report
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[5rem] -mr-10 -mt-10"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Response Time Score</p>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">07:22<span className="text-xl ml-1 text-slate-400">Min</span></h2>
            <p className="text-xs font-bold text-green-600 mt-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_down</span> 15% Lebih Cepat
            </p>
         </div>
         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-10 -mt-10"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Pasien Tertangani</p>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{stats.selesai}</h2>
            <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">Minggu Ini</p>
         </div>
         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[5rem] -mr-10 -mt-10"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Survival Rate</p>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">98.2<span className="text-xl ml-1 text-slate-400">%</span></h2>
            <p className="text-xs font-bold text-blue-600 mt-4 uppercase tracking-widest">Target: 95.0%</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-slate-900 p-10 rounded-[3rem] text-white">
            <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-10 flex items-center gap-3">
               <span className="material-symbols-outlined">analytics</span> Distribusi Kasus Medis
            </h3>
            <div className="space-y-6">
               {[
                 { label: 'Kecelakaan (Trauma)', val: 45, color: 'bg-red-500' },
                 { label: 'Ibu Hamil & Anak', val: 30, color: 'bg-blue-500' },
                 { label: 'Gawat Darurat Umum', val: 25, color: 'bg-orange-500' }
               ].map(i => (
                 <div key={i.label}>
                   <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                     <span className="text-slate-400">{i.label}</span>
                     <span>{i.val}%</span>
                   </div>
                   <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                     <div className={`h-full ${i.color} rounded-full`} style={{ width: `${i.val}%` }}></div>
                   </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3rem] border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
               <span className="material-symbols-outlined text-red-600">stars</span> Top Performance Teams
            </h3>
            <div className="space-y-6">
              {[
                { name: 'AMBULANCE ALPHA', score: 4.9, cases: 124 },
                { name: 'AMBULANCE BETA', score: 4.7, cases: 108 },
                { name: 'TIM RESPON CEPAT', score: 4.5, cases: 89 }
              ].map(t => (
                <div key={t.name} className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl">
                   <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 uppercase">{t.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.cases} Kasus Selesai</p>
                   </div>
                   <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-yellow-500 fill-1">star</span>
                      <span className="text-sm font-black text-slate-900">{t.score}</span>
                   </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto pb-20">
        {user.role === UserRole.WARGA && <WargaDashboard />}
        {user.role === UserRole.ADMIN && <AdminDashboard />}
        {user.role === UserRole.RELAWAN && <RelawanDashboard />}
        {user.role === UserRole.PIMPINAN && <PimpinanDashboard />}
      </div>
    </Layout>
  );
};
