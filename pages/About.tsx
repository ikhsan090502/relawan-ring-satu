import React from 'react';
import { Layout } from '../components/Layout';

export const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Tentang Relawan Ring Satu</h1>
          <p className="text-slate-500 font-medium">Informasi resmi tentang organisasi dan struktur relawan kesehatan kecamatan.</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600">info</span> Visi & Misi
            </h3>
            <div className="space-y-4 text-slate-700">
              <p><strong>Visi:</strong> Mewujudkan sistem koordinasi ambulance terpadu yang menjamin respon medis di bawah 15 menit di seluruh wilayah Kecamatan Ring Satu.</p>
              <p><strong>Misi:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Menyediakan platform digital untuk koordinasi real-time antara warga, dispatcher, dan tim ambulance.</li>
                <li>Meningkatkan efektivitas respon darurat melalui teknologi AI dan data-driven decision making.</li>
                <li>Membangun komunitas relawan kesehatan yang terlatih dan siap siaga 24/7.</li>
                <li>Menyediakan transparansi penuh dalam setiap proses evakuasi medis.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600">groups</span> Struktur Organisasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl">
                <h4 className="font-black text-slate-900 uppercase mb-3">Pimpinan</h4>
                <p className="text-sm text-slate-600">Kepala Dinas Kesehatan Kecamatan Ring Satu</p>
                <p className="text-xs text-slate-500 mt-2">Monitoring & Evaluasi</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <h4 className="font-black text-slate-900 uppercase mb-3">Admin/Dispatcher</h4>
                <p className="text-sm text-slate-600">Tim Verifikasi & Koordinasi</p>
                <p className="text-xs text-slate-500 mt-2">Penerimaan laporan & penugasan tim</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <h4 className="font-black text-slate-900 uppercase mb-3">Tim Ambulance</h4>
                <p className="text-sm text-slate-600">Relawan ALS & BLS</p>
                <p className="text-xs text-slate-500 mt-2">Eksekusi evakuasi medis</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <h4 className="font-black text-slate-900 uppercase mb-3">Warga/Pemohon</h4>
                <p className="text-sm text-slate-600">Masyarakat Kecamatan Ring Satu</p>
                <p className="text-xs text-slate-500 mt-2">Pelaporan & partisipasi aktif</p>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">contact_support</span> Kontak & Dukungan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-black mb-3">Call Center 24/7</h4>
                <p className="text-slate-300 text-sm mb-2">119 - Ambulance Darurat</p>
                <p className="text-slate-400 text-xs">Untuk keadaan darurat segera hubungi nomor ini</p>
              </div>
              <div>
                <h4 className="font-black mb-3">Email Resmi</h4>
                <p className="text-slate-300 text-sm mb-2">info@ring-satu.id</p>
                <p className="text-slate-400 text-xs">Untuk informasi dan kerjasama</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};