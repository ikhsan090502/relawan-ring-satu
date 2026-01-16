
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import dbService from '../services/dbService';
import { UserRole, Report, User, ReportStatus } from '../types';
import jsPDF from 'jspdf';

export const Analytics: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [volunteers, setVolunteers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsData = await dbService.getReports();
        const usersData = await dbService.getUsers();
        const volunteersData = usersData.filter(u => u.role === UserRole.RELAWAN);
        setReports(reportsData);
        setVolunteers(volunteersData);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      }
    };
    fetchData();
  }, []);

  const exportMonthlyPDF = () => {
    const doc = new jsPDF();
    const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    doc.setFontSize(20);
    doc.text('Rekapitulasi Bulanan Layanan Medis', 20, 30);
    doc.text(`Relawan Ring Satu - ${currentMonth}`, 20, 45);

    doc.setFontSize(14);
    doc.text('Ringkasan Kinerja:', 20, 70);
    doc.text(`- Total Laporan Masuk: ${reports.length}`, 20, 85);
    doc.text(`- Laporan Disetujui: ${reports.filter(r => r.status !== 'Ditolak/Non-Medis').length}`, 20, 100);
    doc.text(`- Laporan Selesai: ${reports.filter(r => r.status === 'Selesai/Pasien Diserahterimakan').length}`, 20, 115);

    doc.text('Distribusi Status:', 20, 140);
    const statusCounts = reports.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let yPos = 155;
    Object.entries(statusCounts).forEach(([status, count]) => {
      doc.text(`- ${status}: ${count} laporan`, 20, yPos);
      yPos += 15;
    });

    doc.text('Performa Tim:', 20, yPos + 10);
    const volunteerStats = volunteers.map(v => {
      const tasks = reports.filter(r => r.assignedVolunteerId === v.id && r.status === ReportStatus.SELESAI).length;
      return `${v.name}: ${tasks} tugas selesai`;
    });

    yPos += 25;
    volunteerStats.forEach(stat => {
      doc.text(`- ${stat}`, 20, yPos);
      yPos += 15;
    });

    doc.save(`rekapitulasi-bulanan-${currentMonth.replace(' ', '-').toLowerCase()}.pdf`);
  };
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Analitik Layanan Medis</h1>
            <p className="text-slate-500 font-medium mt-4">Statistik performa Tim Ambulance dan Triase Kesehatan Kecamatan Ring Satu.</p>
          </div>
          <button onClick={exportMonthlyPDF} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined">download</span> Ekspor Rekapitulasi Bulanan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Avg. Dispatch Time</p>
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter">02:15<span className="text-xl ml-1 text-slate-400">Menit</span></h2>
             <p className="text-xs font-bold text-green-600 mt-4 flex items-center gap-1">
               <span className="material-symbols-outlined text-sm">trending_down</span> Efisiensi Meningkat 12%
             </p>
           </div>
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Evakuasi Medis</p>
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter">1,204</h2>
             <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">Tahun Berjalan 2024</p>
           </div>
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Survivor Rate (Triase Merah)</p>
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter">94.8<span className="text-xl ml-1 text-slate-400">%</span></h2>
             <p className="text-xs font-bold text-blue-600 mt-4 uppercase tracking-widest">Kualitas Layanan ALS Prima</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">clinical_notes</span> Kasus Medis Terbanyak
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Kecelakaan Lalu Lintas', val: 42, color: 'bg-red-500' },
                  { label: 'Lansia / Gawat Darurat Jantung', val: 28, color: 'bg-orange-500' },
                  { label: 'Ibu Hamil / Melahirkan', val: 20, color: 'bg-blue-500' },
                  { label: 'Transportasi Medis (Pasca RS)', val: 10, color: 'bg-slate-300' }
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900">{item.val}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
              <h3 className="font-black mb-8 uppercase tracking-widest text-xs flex items-center gap-2 relative z-10">
                <span className="material-symbols-outlined text-primary">award_star</span> Performa Tim Ambulance
              </h3>
              <div className="space-y-6 relative z-10">
                {[
                  { name: 'AMBULANCE ALPHA (ALS)', tasks: 142, rating: 4.9 },
                  { name: 'AMBULANCE BETA (BLS)', tasks: 128, rating: 4.8 },
                  { name: 'TIM RESPON REAKSI CEPAT', tasks: 98, rating: 4.7 }
                ].map((r, i) => (
                  <div key={r.name} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-white/5 transition-all">
                    <span className="font-black text-3xl text-white/10 italic">#0{i+1}</span>
                    <div className="flex-1">
                      <p className="font-black text-sm uppercase tracking-tighter">{r.name}</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{r.tasks} Evakuasi Selesai</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-primary mb-1">
                        <span className="material-symbols-outlined text-sm fill-1">star</span>
                        <span className="text-sm font-black text-white">{r.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
};
