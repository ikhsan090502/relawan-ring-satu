
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { Report, ReportStatus, UserRole, User } from '../types';
import jsPDF from 'jspdf';

export const ReportDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [volunteers, setVolunteers] = useState<User[]>([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({
    chronology: '',
    result: '',
    photo: null as File | null,
    photoPreview: ''
  });

  useEffect(() => {
    if (id) {
      const foundReport = dbService.getReportById(id);
      if (foundReport) {
        setReport(foundReport);
        if (foundReport.assignedVolunteerId) {
          setSelectedVolunteerId(foundReport.assignedVolunteerId);
        }
      }
    }
    setCurrentUser(authService.getCurrentUser());
    setVolunteers(dbService.getUsersByRole(UserRole.RELAWAN));
  }, [id]);

  const handleAssignTeam = () => {
    if (!report || !selectedVolunteerId) return;

    const updatedReport: Report = {
      ...report,
      status: ReportStatus.DISETUJUI,
      assignedVolunteerId: selectedVolunteerId,
      adminNotes: `${report.adminNotes || ''}\n[DISPATCH]: Tim ditugaskan pada ${new Date().toLocaleTimeString()}`.trim()
    };

    dbService.updateReport(updatedReport);
    setReport(updatedReport);
    setShowAssign(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportForm(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setReportForm(prev => ({ ...prev, photoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReport = () => {
    if (!report || !reportForm.chronology || !reportForm.result) {
      alert("Mohon lengkapi kronologi dan hasil penanganan.");
      return;
    }

    const updated: Report = {
      ...report,
      status: ReportStatus.SELESAI,
      volunteerReport: {
        actionTaken: reportForm.result,
        hospitalName: 'RS Terdekat', // Placeholder
        photo: reportForm.photoPreview
      },
      adminNotes: `${report.adminNotes || ''}\n[SELESAI]: Laporan dikirim oleh relawan pada ${new Date().toLocaleTimeString()}\nKronologi: ${reportForm.chronology}\nHasil: ${reportForm.result}`.trim()
    };
    dbService.updateReport(updated);
    setReport(updated);
    setShowReportForm(false);
  };

  const exportSpecificReport = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Laporan Detail Evakuasi Medis', 20, 30);
    doc.text(`ID: ${report.id}`, 20, 45);

    doc.setFontSize(14);
    doc.text('Informasi Pasien:', 20, 70);
    doc.text(`Nama: ${report.patientName}`, 20, 85);
    doc.text(`Usia: ${report.patientAge} tahun`, 20, 100);
    doc.text(`Kategori: ${report.category}`, 20, 115);
    doc.text(`Lokasi: ${report.location}`, 20, 130);

    doc.text('Detail Kejadian:', 20, 155);
    doc.text(`Tanggal: ${report.eventDate}`, 20, 170);
    doc.text(`Waktu: ${report.eventTime}`, 20, 185);
    doc.text(`Status: ${report.status}`, 20, 200);
    doc.text(`Urgensi: ${report.urgency}`, 20, 215);

    if (report.adminNotes) {
      doc.text('Catatan Sistem:', 20, 240);
      const notes = doc.splitTextToSize(report.adminNotes, 170);
      doc.text(notes, 20, 255);
    }

    doc.save(`laporan-${report.id}.pdf`);
  };

  const updateStatus = (newStatus: ReportStatus) => {
    if (!report) return;

    const confirmText = newStatus === ReportStatus.SELESAI
      ? "Konfirmasi penyelesaian tugas medis?"
      : `Update status ke: ${newStatus}?`;

    if (window.confirm(confirmText)) {
      const updated: Report = {
        ...report,
        status: newStatus,
        adminNotes: `${report.adminNotes || ''}\n[${newStatus.toUpperCase()}]: ${new Date().toLocaleTimeString()}`.trim()
      };
      dbService.updateReport(updated);
      setReport(updated);

      // Placeholder notifikasi WhatsApp
      console.log(`[WhatsApp Notification] Status laporan ${report.id} berubah menjadi: ${newStatus}`);
      console.log(`Pesan yang akan dikirim ke ${report.whatsapp}: "Status laporan ${report.id} telah diupdate menjadi ${newStatus}"`);
      alert(`Notifikasi WhatsApp placeholder: Status laporan ${report.id} telah diupdate. (Implementasi API WhatsApp diperlukan)`);
    }
  };

  if (!report || !currentUser) return null;

  const isAssignedToMe = report.assignedVolunteerId === currentUser.id;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigate(-1)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-red-600 transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali
            </button>
            <div className="flex items-center gap-4">
              {currentUser?.role === UserRole.PIMPINAN && (
                <button onClick={exportSpecificReport} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <span className="material-symbols-outlined text-sm">download</span> Ekspor PDF
                </button>
              )}
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${report.urgency.includes('Merah') ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                Urgensi: {report.urgency}
              </span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-black italic tracking-tighter uppercase">{report.id}</h1>
                  <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-[3px]">{report.status}</p>
                </div>
                <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">medical_services</span>
                </div>
              </div>

              <div className="p-10 space-y-10">
                <section className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Identitas Pasien</h4>
                    <p className="text-2xl font-black text-slate-900 leading-none">{report.patientName}</p>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase">{report.patientAge} Tahun • {report.category}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Titik Penjemputan</h4>
                    <p className="text-sm font-black text-slate-900">{report.location}</p>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Kondisi Medis Pasien</h4>
                  <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem]">
                    <p className="text-red-900 font-bold leading-relaxed italic">"{report.description}"</p>
                  </div>
                </section>

                {report.adminNotes && (
                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Log Sistem & Dispatcher</h4>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 font-mono text-[11px] whitespace-pre-wrap text-slate-600">
                      {report.adminNotes}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Control Panel: Admin */}
            {currentUser.role === UserRole.ADMIN && report.status !== ReportStatus.SELESAI && (
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600">support_agent</span> Dispatcher Control
                </h3>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <button
                    onClick={() => updateStatus(ReportStatus.DITOLAK)}
                    className="w-full py-3 bg-red-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-800 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">cancel</span> TOLAK
                  </button>
                  <button
                    onClick={() => updateStatus(ReportStatus.KLARIFIKASI)}
                    className="w-full py-3 bg-yellow-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">help</span> MINTA KLARIFIKASI
                  </button>
                  <button
                    onClick={() => setShowAssign(true)}
                    className="w-full py-3 bg-green-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">check_circle</span> SETUJUI & KIRIM TIM
                  </button>
                </div>
              </div>
            )}

            {/* Control Panel: Relawan (Hanya jika ditugaskan) */}
            {currentUser.role === UserRole.RELAWAN && isAssignedToMe && report.status !== ReportStatus.SELESAI && (
              <div className="bg-red-600 p-8 rounded-[2.5rem] text-white shadow-2xl">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined">radio</span> Tim Ambulance Lapangan
                </h3>

                <div className="mb-4">
                  <label className="block text-[10px] font-black uppercase text-red-200 mb-2">Update Status Tugas</label>
                  <select
                    onChange={(e) => updateStatus(e.target.value as ReportStatus)}
                    className="w-full py-3 px-4 bg-white text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest"
                    defaultValue=""
                  >
                    <option value="" disabled>Pilih Status Baru</option>
                    <option value={ReportStatus.MENUJU_LOKASI}>🚐 Menuju Lokasi</option>
                    <option value={ReportStatus.TIBA_DI_LOKASI}>📍 Tiba di Lokasi & Penanganan Dimulai</option>
                    <option value={ReportStatus.MENUJU_RS}>🏥 Menuju Rumah Sakit</option>
                    <option value={ReportStatus.SELESAI}>✅ Selesai / Serah Terima</option>
                  </select>
                </div>

                <button onClick={() => setShowReportForm(true)} className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">task_alt</span> Unggah Laporan Akhir
                </button>
              </div>
            )}

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pemohon Bantuan</h3>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">{report.reporterName}</p>
                  <p className="text-[10px] font-bold text-slate-500 tracking-widest">{report.whatsapp}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Pilih Tim */}
        {showAssign && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl scale-in-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic">Pilih Tim Ambulance</h2>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {volunteers.map(v => (
                  <button key={v.id} onClick={() => setSelectedVolunteerId(v.id)} className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${selectedVolunteerId === v.id ? 'border-red-600 bg-red-50' : 'border-slate-100 hover:border-red-200'}`}>
                    <img src={v.avatar} className="w-14 h-14 rounded-full border-2 border-white" />
                    <div className="text-left">
                      <p className="font-black text-slate-900 uppercase tracking-tighter">{v.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{v.expertise}</p>
                    </div>
                    {selectedVolunteerId === v.id && <span className="material-symbols-outlined ml-auto text-red-600">check_circle</span>}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowAssign(false)} className="flex-1 font-black text-slate-400 text-xs uppercase">Batal</button>
                <button onClick={handleAssignTeam} disabled={!selectedVolunteerId} className="flex-[2] py-5 bg-red-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-red-200">Konfirmasi Penugasan</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Form Laporan Relawan */}
        {showReportForm && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl scale-in-center max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic">Formulir Unggah Laporan</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Kronologi Laporan</label>
                  <textarea
                    required
                    placeholder="Jelaskan kronologi kejadian dari awal hingga akhir..."
                    className="w-full border-slate-200 rounded-xl font-medium min-h-[100px]"
                    value={reportForm.chronology}
                    onChange={e => setReportForm({...reportForm, chronology: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Hasil Penanganan</label>
                  <textarea
                    required
                    placeholder="Jelaskan hasil penanganan pasien (mis: Korban 1 orang, Pohon berhasil dievakuasi)..."
                    className="w-full border-slate-200 rounded-xl font-medium min-h-[80px]"
                    value={reportForm.result}
                    onChange={e => setReportForm({...reportForm, result: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Unggah Foto Dokumentasi (WAJIB)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border-slate-200 rounded-xl" />
                  {reportForm.photoPreview && (
                    <img src={reportForm.photoPreview} className="mt-4 w-full max-h-48 object-cover rounded-xl" alt="Preview" />
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowReportForm(false)} className="flex-1 font-black text-slate-400 text-xs uppercase">Batal</button>
                <button onClick={handleSubmitReport} className="flex-[2] py-5 bg-red-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-red-200">Kirim Laporan</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
