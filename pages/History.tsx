import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import dbService from '../services/dbService';
import authService from '../services/authService';
import { ReportStatus, Report, UserRole, User } from '../types';
import { useNavigate } from 'react-router-dom';

export const History: React.FC = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('Semua');
  const [reports, setReports] = useState<Report[]>([]);
  const [volunteers, setVolunteers] = useState<User[]>([]);
  const [volunteerFilter, setVolunteerFilter] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('');
  const [user] = useState(authService.getCurrentUser());

  /* =========================
     LOAD RELAWAN (PIMPINAN)
     ========================= */
  useEffect(() => {
    const loadVolunteers = async () => {
      if (user?.role !== UserRole.PIMPINAN) return;

      try {
        const data = await dbService.getUsersByRole(UserRole.RELAWAN);
        setVolunteers(data);
      } catch (err) {
        console.error('Gagal load relawan:', err);
      }
    };

    loadVolunteers();
  }, [user]);

  /* =========================
     LOAD HISTORY
     ========================= */
  useEffect(() => {
    const loadHistory = async () => {
      let data: Report[] = await dbService.getReports();

      // Filter berdasarkan role
      if (user?.role === UserRole.WARGA) {
        data = data.filter(r => r.reporterName === user.name);
      } else if (user?.role === UserRole.RELAWAN) {
        data = data.filter(r =>
          r.assignedVolunteerId == user.id ||
          (r.assignedVolunteerId === null && r.status === ReportStatus.MENUNGGU)
        );
      }

      // Filter status
      if (activeFilter !== 'Semua') {
        data = data.filter(r => r.status === activeFilter);
      }

      // Filter relawan (pimpinan)
      if (volunteerFilter !== 'Semua' && user?.role === UserRole.PIMPINAN) {
        data = data.filter(r => r.assignedVolunteerId === volunteerFilter);
      }

      // Filter tanggal (pimpinan)
      if (dateFilter && user?.role === UserRole.PIMPINAN) {
        data = data.filter(r => r.eventDate === dateFilter);
      }

      setReports(data);
    };

    loadHistory();
  }, [activeFilter, volunteerFilter, dateFilter, user]);

  const updateStatus = async (reportId: string, newStatus: ReportStatus) => {
    if (window.confirm(`Update status laporan ${reportId} ke: ${newStatus}?`)) {
      try {
        const report = reports.find(r => r.id === reportId);
        if (!report) return;

        const updated: Report = {
          ...report,
          status: newStatus,
          adminNotes: `${report.adminNotes || ''}\n[${newStatus.toUpperCase()}]: ${new Date().toLocaleTimeString()}`
        };
        await dbService.updateReport(updated);

        // Refresh the reports
        const loadHistory = async () => {
          let data: Report[] = await dbService.getReports();

          // Filter berdasarkan role
          if (user?.role === UserRole.WARGA) {
            data = data.filter(r => r.reporterName === user.name);
          } else if (user?.role === UserRole.RELAWAN) {
            data = data.filter(r =>
              r.assignedVolunteerId == user.id ||
              (r.assignedVolunteerId === null && r.status === ReportStatus.MENUNGGU)
            );
          }

          // Filter status
          if (activeFilter !== 'Semua') {
            data = data.filter(r => r.status === activeFilter);
          }

          // Filter relawan (pimpinan)
          if (volunteerFilter !== 'Semua' && user?.role === UserRole.PIMPINAN) {
            data = data.filter(r => r.assignedVolunteerId === volunteerFilter);
          }

          // Filter tanggal (pimpinan)
          if (dateFilter && user?.role === UserRole.PIMPINAN) {
            data = data.filter(r => r.eventDate === dateFilter);
          }

          setReports(data);
        };

        loadHistory();
      } catch (error) {
        console.error('Failed to update status:', error);
        alert('Gagal update status');
      }
    }
  };

  const filters = [
    'Semua',
    ReportStatus.MENUNGGU,
    ReportStatus.DISETUJUI,
    ReportStatus.SELESAI,
    ReportStatus.DITOLAK,
    ReportStatus.KLARIFIKASI
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
              Riwayat Medis
            </h1>
            <p className="text-slate-500 mt-2">
              Daftar lengkap permohonan bantuan ambulance dan status evakuasi.
            </p>
          </div>

          {user?.role === UserRole.WARGA && (
            <button
              onClick={() => navigate('/create-report')}
              className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-red-200 flex items-center gap-2 hover:bg-red-700 transition-all uppercase tracking-widest text-xs"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Panggil Ambulance
            </button>
          )}
        </div>

        {/* FILTER */}
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

          {/* FILTER LANJUTAN PIMPINAN */}
          {user?.role === UserRole.PIMPINAN && (
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Filter Lanjutan
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                    Filter Relawan
                  </label>
                  <select
                    value={volunteerFilter}
                    onChange={e => setVolunteerFilter(e.target.value)}
                    className="w-full border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Semua">Semua Relawan</option>
                    {volunteers.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                    Filter Tanggal
                  </label>
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

        {/* TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-5">Identitas</th>
                  <th className="px-8 py-5">Kategori Medis</th>
                  <th className="px-8 py-5">Lokasi</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reports.map(r => (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/report/${r.id}`)}
                    className="hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <p className="text-sm font-black">{r.id}</p>
                      <p className="text-[10px] text-slate-400 uppercase">
                        {r.patientName}
                      </p>
                    </td>

                    <td className="px-8 py-6 text-xs font-bold">
                      {r.category}
                    </td>

                    <td className="px-8 py-6 text-xs truncate max-w-[200px]">
                      {r.location}
                    </td>

                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase">
                        {r.status}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right">
                      {user?.role === UserRole.RELAWAN && r.assignedVolunteerId == user.id && r.status !== ReportStatus.SELESAI ? (
                        <select
                          onChange={(e) => updateStatus(r.id, e.target.value as ReportStatus)}
                          className="px-3 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase"
                          defaultValue=""
                        >
                          <option value="" disabled>Update Status</option>
                          <option value={ReportStatus.MENUJU_LOKASI}>🚐 Menuju Lokasi</option>
                          <option value={ReportStatus.TIBA_DI_LOKASI}>📍 Penanganan Pasien</option>
                          <option value={ReportStatus.MENUJU_RS}>🏥 Menuju Rumah Sakit</option>
                          <option value={ReportStatus.SELESAI}>✅ Selesai</option>
                          <option value="Dibatalkan">❌ Dibatalkan</option>
                        </select>
                      ) : (
                        <button className="w-10 h-10 bg-slate-100 rounded-xl">
                          <span className="material-symbols-outlined text-sm">
                            visibility
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {reports.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-12 text-center text-slate-400 italic"
                    >
                      Data riwayat medis tidak ditemukan.
                    </td>
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
