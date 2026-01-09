
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { analyzeReportDescription } from '../services/geminiService'; // Tetap menggunakan nama file lama agar tidak perlu ganti struktur file, tapi logika sudah murni
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { ReportStatus, IncidentCategory, Report } from '../types';

export const CreateReport: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user] = useState(authService.getCurrentUser());

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    eventDate: '',
    eventTime: '',
    category: 'Lainnya' as IncidentCategory,
    location: '',
    locationLink: '',
    needs: [] as string[],
    description: '',
    urgency: 'Hijau (Stabil)' as any
  });
  const [evidencePhoto, setEvidencePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const categories: IncidentCategory[] = ['Gawat Darurat', 'Kecelakaan', 'Ibu Hamil/Melahirkan', 'Lansia/Sakit Kronis', 'Transportasi Medis', 'Lainnya'];
  const commonNeeds = ['Oksigen', 'Kursi Roda', 'Tandu/Stretcher', 'Monitor Jantung', 'Nebulizer', 'P3K Dasar'];

  const toggleNeed = (need: string) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(need) ? prev.needs.filter(n => n !== need) : [...prev.needs, need]
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidencePhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = async (val: string) => {
    setFormData(prev => ({ ...prev, description: val }));
    
    // Auto-triage murni berjalan jika deskripsi cukup panjang
    if (val.length > 5) {
      const analysis = await analyzeReportDescription(val);
      setFormData(prev => ({
        ...prev,
        category: analysis.category as any,
        urgency: analysis.urgency as any
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.description || !formData.location) {
      alert("Mohon lengkapi data pasien, deskripsi, dan lokasi.");
      return;
    }

    setIsSubmitting(true);

    const newReport: Report = {
      id: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
      reporterName: user?.name || 'Warga Anonim',
      whatsapp: user?.phone || '',
      patientName: formData.patientName,
      patientAge: formData.patientAge,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      category: formData.category,
      location: formData.location,
      locationLink: formData.locationLink,
      urgentNeeds: formData.needs,
      description: formData.description,
      chronology: formData.description,
      evidencePhoto: photoPreview,
      status: ReportStatus.MENUNGGU,
      urgency: formData.urgency,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      dbService.saveReport(newReport);
      setIsSubmitting(false);
      navigate(`/report/${newReport.id}`);
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="text-xs font-black text-slate-400 hover:text-red-500 flex items-center gap-1 uppercase tracking-widest mb-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali
            </button>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Panggil Ambulance</h1>
          </div>
          <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 animate-pulse">
            <span className="material-symbols-outlined text-4xl">medical_services</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">person</span> Informasi Pasien
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Nama Pasien</label>
                <input required type="text" placeholder="Nama Lengkap Pasien" className="w-full border-slate-200 rounded-xl font-bold" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Usia Pasien</label>
                <input required type="number" placeholder="Contoh: 45" className="w-full border-slate-200 rounded-xl font-bold" value={formData.patientAge} onChange={e => setFormData({...formData, patientAge: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Hari/Tanggal Kejadian</label>
                <input required type="date" className="w-full border-slate-200 rounded-xl font-bold" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Jam Kejadian</label>
                <input required type="time" className="w-full border-slate-200 rounded-xl font-bold" value={formData.eventTime} onChange={e => setFormData({...formData, eventTime: e.target.value})} />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">emergency</span> Kondisi & Kebutuhan
            </h3>
            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Deskripsi Kondisi (Sistem Akan Mendeteksi Otomatis)</label>
              <textarea required placeholder="Jelaskan apa yang dirasakan pasien..." className="w-full border-slate-200 rounded-xl font-medium min-h-[120px]" value={formData.description} onChange={e => handleDescriptionChange(e.target.value)}></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Kategori Terdeteksi</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as IncidentCategory})} className="w-full border-slate-200 rounded-xl font-bold bg-slate-50">
                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Urgensi Triase</label>
                <div className={`p-3 rounded-xl border text-sm font-black text-center transition-all ${
                  formData.urgency.includes('Merah') ? 'bg-red-500 text-white border-red-500' : 
                  formData.urgency.includes('Kuning') ? 'bg-orange-500 text-white border-orange-500' : 'bg-green-500 text-white border-green-500'
                }`}>
                  {formData.urgency}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Alat Tambahan</label>
              <div className="flex flex-wrap gap-2">
                {commonNeeds.map(need => (
                  <button key={need} type="button" onClick={() => toggleNeed(need)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${formData.needs.includes(need) ? 'bg-red-600 text-white border-red-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {need}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Alamat Penjemputan</label>
              <textarea required placeholder="Contoh: Jl. Ring Satu No 12, Blok A..." className="w-full border-slate-200 rounded-xl font-medium min-h-[80px]" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Link Lokasi (Opsional)</label>
              <input type="url" placeholder="https://maps.google.com/..." className="w-full border-slate-200 rounded-xl font-medium" value={formData.locationLink} onChange={e => setFormData({...formData, locationLink: e.target.value})} />
              <p className="text-[9px] text-slate-400 mt-1">Bagikan link Google Maps untuk lokasi yang lebih akurat.</p>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Foto Kejadian (Opsional)</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full border-slate-200 rounded-xl" />
              {photoPreview && (
                <img src={photoPreview} className="mt-4 w-full max-h-48 object-cover rounded-xl" alt="Evidence" />
              )}
            </div>
          </section>

          <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-red-200">
            {isSubmitting ? 'MENGHUBUNGI TIM...' : 'PANGGIL AMBULANCE SEKARANG'}
          </button>
        </form>
      </div>
    </Layout>
  );
};
