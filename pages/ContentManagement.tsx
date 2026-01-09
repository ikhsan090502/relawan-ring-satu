import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface MasterData {
  id: number;
  type: string;
  value: string;
}

export const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'master' | 'settings'>('faq');
  const [whatsappNumber, setWhatsappNumber] = useState('081100001111');

  useEffect(() => {
    const storedNumber = localStorage.getItem('adminWhatsappNumber');
    if (storedNumber) {
      setWhatsappNumber(storedNumber);
    }
  }, []);

  // Mock data - in real app, this would come from API
  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: 1, question: 'ambulance', answer: 'Untuk memanggil ambulance, klik tombol "Panggil Ambulance" di dashboard utama.' },
    { id: 2, question: 'p3k', answer: 'Panduan P3K tersedia di menu utama. Klik "Panduan P3K" untuk melihat langkah-langkah.' },
    { id: 3, question: 'status', answer: 'Untuk melihat status laporan Anda, buka menu "Riwayat Medis".' }
  ]);

  const [masterData, setMasterData] = useState<MasterData[]>([
    { id: 1, type: 'Kategori Kejadian', value: 'Gawat Darurat' },
    { id: 2, type: 'Kategori Kejadian', value: 'Kecelakaan' },
    { id: 3, type: 'Alat Tambahan', value: 'Oksigen' },
    { id: 4, type: 'Alat Tambahan', value: 'Kursi Roda' }
  ]);

  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingMaster, setEditingMaster] = useState<MasterData | null>(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newMaster, setNewMaster] = useState({ type: '', value: '' });

  const handleSaveFaq = () => {
    if (editingFaq) {
      setFaqs(faqs.map(f => f.id === editingFaq.id ? editingFaq : f));
      setEditingFaq(null);
    } else {
      setFaqs([...faqs, { id: Date.now(), ...newFaq }]);
      setNewFaq({ question: '', answer: '' });
    }
  };

  const handleSaveMaster = () => {
    if (editingMaster) {
      setMasterData(masterData.map(m => m.id === editingMaster.id ? editingMaster : m));
      setEditingMaster(null);
    } else {
      setMasterData([...masterData, { id: Date.now(), ...newMaster }]);
      setNewMaster({ type: '', value: '' });
    }
  };

  const handleDeleteFaq = (id: number) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const handleDeleteMaster = (id: number) => {
    setMasterData(masterData.filter(m => m.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Kelola Konten Sistem</h1>
          <p className="text-slate-500 font-medium">Kelola FAQ chatbot dan data master aplikasi.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-fit mb-8">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'faq' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            FAQ Chatbot
          </button>
          <button
            onClick={() => setActiveTab('master')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'master' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Data Master
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'settings' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Pengaturan Sistem
          </button>
        </div>

        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* Add New FAQ */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h3 className="font-black text-slate-900 mb-4">Tambah FAQ Baru</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Kata kunci (contoh: ambulance)"
                  value={newFaq.question}
                  onChange={e => setNewFaq({...newFaq, question: e.target.value})}
                  className="w-full border-slate-200 rounded-xl font-bold"
                />
                <textarea
                  placeholder="Jawaban FAQ"
                  value={newFaq.answer}
                  onChange={e => setNewFaq({...newFaq, answer: e.target.value})}
                  className="w-full border-slate-200 rounded-xl font-medium min-h-[80px]"
                />
                <button
                  onClick={handleSaveFaq}
                  disabled={!newFaq.question || !newFaq.answer}
                  className="bg-red-600 text-white px-6 py-2 rounded-xl font-black hover:bg-red-700 disabled:opacity-50"
                >
                  Tambah FAQ
                </button>
              </div>
            </div>

            {/* FAQ List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-black text-slate-900">Daftar FAQ</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {faqs.map(faq => (
                  <div key={faq.id} className="p-6">
                    {editingFaq?.id === faq.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingFaq.question}
                          onChange={e => setEditingFaq({...editingFaq, question: e.target.value})}
                          className="w-full border-slate-200 rounded-xl font-bold"
                        />
                        <textarea
                          value={editingFaq.answer}
                          onChange={e => setEditingFaq({...editingFaq, answer: e.target.value})}
                          className="w-full border-slate-200 rounded-xl font-medium min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <button onClick={handleSaveFaq} className="bg-green-600 text-white px-4 py-2 rounded-xl font-black">Simpan</button>
                          <button onClick={() => setEditingFaq(null)} className="bg-slate-400 text-white px-4 py-2 rounded-xl font-black">Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-black text-slate-900 mb-2">Kata kunci: {faq.question}</p>
                          <p className="text-slate-600">{faq.answer}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button onClick={() => setEditingFaq(faq)} className="text-blue-600 hover:text-blue-800">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button onClick={() => handleDeleteFaq(faq.id)} className="text-red-600 hover:text-red-800">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'master' && (
          <div className="space-y-6">
            {/* Add New Master Data */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h3 className="font-black text-slate-900 mb-4">Tambah Data Master Baru</h3>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newMaster.type}
                  onChange={e => setNewMaster({...newMaster, type: e.target.value})}
                  className="border-slate-200 rounded-xl font-bold"
                >
                  <option value="">Pilih Tipe</option>
                  <option value="Kategori Kejadian">Kategori Kejadian</option>
                  <option value="Alat Tambahan">Alat Tambahan</option>
                  <option value="Status">Status</option>
                </select>
                <input
                  type="text"
                  placeholder="Nilai"
                  value={newMaster.value}
                  onChange={e => setNewMaster({...newMaster, value: e.target.value})}
                  className="border-slate-200 rounded-xl font-bold"
                />
              </div>
              <button
                onClick={handleSaveMaster}
                disabled={!newMaster.type || !newMaster.value}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl font-black hover:bg-red-700 disabled:opacity-50"
              >
                Tambah Data Master
              </button>
            </div>

            {/* Master Data List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-black text-slate-900">Daftar Data Master</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {masterData.map(item => (
                  <div key={item.id} className="p-6">
                    {editingMaster?.id === item.id ? (
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={editingMaster.type}
                          onChange={e => setEditingMaster({...editingMaster, type: e.target.value})}
                          className="border-slate-200 rounded-xl font-bold"
                        >
                          <option value="Kategori Kejadian">Kategori Kejadian</option>
                          <option value="Alat Tambahan">Alat Tambahan</option>
                          <option value="Status">Status</option>
                        </select>
                        <input
                          type="text"
                          value={editingMaster.value}
                          onChange={e => setEditingMaster({...editingMaster, value: e.target.value})}
                          className="border-slate-200 rounded-xl font-bold"
                        />
                        <div className="col-span-2 flex gap-2">
                          <button onClick={handleSaveMaster} className="bg-green-600 text-white px-4 py-2 rounded-xl font-black">Simpan</button>
                          <button onClick={() => setEditingMaster(null)} className="bg-slate-400 text-white px-4 py-2 rounded-xl font-black">Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-bold mb-2">{item.type}</span>
                          <p className="font-black text-slate-900">{item.value}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingMaster(item)} className="text-blue-600 hover:text-blue-800">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button onClick={() => handleDeleteMaster(item.id)} className="text-red-600 hover:text-red-800">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h3 className="font-black text-slate-900 mb-4">Pengaturan WhatsApp Admin</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Nomor WhatsApp Admin</label>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-green-500">chat</span>
                      <input
                        type="tel"
                        placeholder="0812xxxx"
                        value={whatsappNumber}
                        onChange={e => setWhatsappNumber(e.target.value)}
                        className="w-full h-14 pl-12 pr-5 bg-slate-50 border-slate-200 rounded-2xl font-bold focus:ring-green-500 focus:border-green-500 transition-all"
                      />
                    </div>
                    <button
                      onClick={() => {
                        // Save to localStorage or API
                        localStorage.setItem('adminWhatsappNumber', whatsappNumber);
                        alert('Nomor WhatsApp berhasil disimpan!');
                      }}
                      className="bg-green-600 text-white px-8 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-200"
                    >
                      Simpan
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-400 font-medium italic">
                    *Nomor ini akan digunakan untuk tombol WhatsApp yang muncul di halaman login dan akun non-warga.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};