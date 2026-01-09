import React from 'react';
import { Layout } from '../components/Layout';

export const P3KGuide: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Panduan Pertolongan Pertama (P3K)</h1>
          <p className="text-slate-500 font-medium">Panduan dasar penanganan darurat medis sebelum bantuan tiba.</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600">emergency</span> Prinsip Dasar P3K
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-red-50 rounded-2xl">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-red-600 text-2xl">visibility</span>
                </div>
                <h4 className="font-black text-slate-900 mb-2">Lihat Sekitar</h4>
                <p className="text-sm text-slate-600">Pastikan area aman dari bahaya</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-blue-600 text-2xl">call</span>
                </div>
                <h4 className="font-black text-slate-900 mb-2">Hubungi Bantuan</h4>
                <p className="text-sm text-slate-600">Panggil ambulance atau tim medis</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-green-600 text-2xl">healing</span>
                </div>
                <h4 className="font-black text-slate-900 mb-2">Berikan Pertolongan</h4>
                <p className="text-sm text-slate-600">Lakukan tindakan P3K yang tepat</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600">medical_services</span> Panduan Kondisi Darurat
            </h3>
            <div className="space-y-6">
              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                <h4 className="font-black text-red-900 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined">heart_minus</span> Serangan Jantung
                </h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Bantu korban duduk atau berbaring dengan nyaman</li>
                  <li>• Longgarkan pakaian yang ketat</li>
                  <li>• Jika korban sadar, berikan aspirin jika tersedia</li>
                  <li>• Lakukan CPR jika korban tidak sadar</li>
                </ul>
              </div>

              <div className="p-6 bg-orange-50 border border-orange-100 rounded-2xl">
                <h4 className="font-black text-orange-900 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined">personal_injury</span> Pendarahan Berat
                </h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Tekan luka dengan kain bersih atau perban</li>
                  <li>• Angkat bagian tubuh yang terluka di atas jantung</li>
                  <li>• Jaga korban tetap hangat dan tenang</li>
                  <li>• Jangan lepaskan benda yang menancap di luka</li>
                </ul>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                <h4 className="font-black text-blue-900 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined">elderly</span> Pingsan/Strok
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Pastikan korban bernapas</li>
                  <li>• Posisikan korban miring jika muntah</li>
                  <li>• Jaga suhu tubuh tetap hangat</li>
                  <li>• Catat waktu kejadian dan gejala</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">call</span> Kontak Darurat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <h4 className="font-black mb-3">Ambulance</h4>
                <p className="text-2xl font-black text-red-400 mb-2">119</p>
                <p className="text-sm text-slate-300">Layanan 24 jam untuk keadaan darurat</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <h4 className="font-black mb-3">Relawan Ring Satu</h4>
                <p className="text-2xl font-black text-blue-400 mb-2">Aplikasi</p>
                <p className="text-sm text-slate-300">Panggil bantuan melalui aplikasi ini</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};