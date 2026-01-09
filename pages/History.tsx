
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { ReportStatus, Report, UserRole } from '../types';
import { useNavigate } from 'react-router-dom';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [reports, setReports] = useState<Report[]>([]);
  const [user] = useState(authService.getCurrentUser());
  const [volunteerFilter, setVolunteerFilter] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    let data = dbService.getReports();

    // Filter berdasarkan role user
    if (user?.role === UserRole.WARGA) {
      data = data.filter(r => r.reporterName === user.name);
    }

    // Filter status
    if (activeFilter !== 'Semua') {
      data = data.filter(r => r.status === activeFilter);
    }

    // Filter relawan (untuk pimpinan)
    if (volunteerFilter !== 'Semua' && user?.role === UserRole.PIMPINAN) {
      data = data.filter(r => r.assignedVolunteerId === volunteerFilter);
    }

    // Filter tanggal (untuk pimpinan)
    if (dateFilter && user?.role === UserRole.PIMPINAN) {
      data = data.filter(r => r.eventDate === dateFilter);
    }

    setReports(data);
  }, [activeFilter, volunteerFilter, dateFilter, user]);

  const filters = ['Semua', ReportStatus.MENUNGGU, ReportStatus.DISETUJUI, ReportStatus.SELESAI, ReportStatus.DITOLAK, ReportStatus.KLARIFIKASI];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Riwayat Medis</h1>
            <p className="text-slate-500 mt-2">Daftar lengkap permohonan bantuan ambulance dan status evakuasi.</p>
          </div>
          <button 
            onClick={() => navigate('/create-report')}
            className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-red-200 flex items-center gap-2 hover:bg-red-700 transition-all uppercase tracking-widest text-xs"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Panggil Ambulance
          </button>
        </div>

        {/* Filter & Search */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeFilter === f
                    ? 'bg-red-600 text-white border-red-600 shadow-md'
                    : 'bg-white text-slate-400 border-slate-200 hover:border-red-500 hover:text-red-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Advanced Filters for Pimpinan */}
          {user?.role === UserRole.PIMPINAN && (
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filter Lanjutan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Filter Relawan</label>
                  <select
                    value={volunteerFilter}
                    onChange={e => setVolunteerFilter(e.target.value)}
                    className="w-full border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Semua">Semua Relawan</option>
                    {dbService.getUsersByRole(UserRole.RELAWAN).map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Filter Tanggal</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="w-full border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table Laporan */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-5">Identitas</th>
                  <th className="px-8 py-5">Kategori Medis</th>
                  <th className="px-8 py-5">Lokasi Jelas</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate(`/report/${r.id}`)}>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{r.id}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.patientName}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                          <span className="material-symbols-outlined text-xl">
                            {r.category === 'Gawat Darurat' ? 'emergency' : 
                             r.category === 'Kecelakaan' ? 'personal_injury' : 
                             r.category === 'Ibu Hamil/Melahirkan' ? 'pregnant_woman' : 
                             r.category === 'Lansia/Sakit Kronis' ? 'elderly' : 
                             r.category === 'Transportasi Medis' ? 'ambulance' : 'medical_services'}
                          </span>
                        </div>
                        <span className="text-xs font-black text-slate-700 uppercase">{r.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500 max-w-[200px] truncate">{r.location}</td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        r.status === ReportStatus.SELESAI 
                          ? 'bg-green-50 text-green-600 border-green-200' 
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {r.status === ReportStatus.KLARIFIKASI && (
                          <button className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase rounded-lg hover:bg-blue-600 transition-all">
                            Kirim Klarifikasi
                          </button>
                        )}
                        <button
                          className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic font-medium">Data riwayat medis tidak ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
