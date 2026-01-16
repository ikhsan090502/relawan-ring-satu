
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import dbService from '../services/dbService';
import { User, UserRole } from '../types';

export const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.RELAWAN);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    address: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: UserRole.RELAWAN,
    password: '',
    expertise: '',
    address: ''
  });

  useEffect(() => {
    const loadUsers = async () => {
      setUsers(await dbService.getUsersByRole(activeTab));
    };
    loadUsers();
  }, [activeTab]);

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Aktif' ? 'Nonaktif' : 'Aktif';
    await dbService.updateUserStatus(userId, nextStatus as any);
    setUsers(await dbService.getUsersByRole(activeTab));
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      expertise: user.expertise || '',
      address: user.address || ''
    });
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      await dbService.deleteUser(userId);
      setUsers(await dbService.getUsersByRole(activeTab));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    await dbService.updateUser({ ...editingUser, ...editForm });
    setUsers(await dbService.getUsersByRole(activeTab));
    setEditingUser(null);
  };

  const handleAddUser = async () => {
    if (!addForm.name || !addForm.email || !addForm.phone || !addForm.password) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    try {
      await dbService.createUser({
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        role: addForm.role,
        password: addForm.password,
        expertise: addForm.role === UserRole.RELAWAN ? addForm.expertise : undefined,
        address: addForm.role === UserRole.WARGA ? addForm.address : undefined
      });
      setUsers(await dbService.getUsersByRole(activeTab));
      setShowAddModal(false);
      setAddForm({ name: '', email: '', phone: '', role: UserRole.RELAWAN, password: '', expertise: '', address: '' });
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Gagal membuat user');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manajemen Database</h1>
            <p className="text-slate-500 mt-1">Kelola data relawan dan warga terdaftar dalam sistem.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined">person_add</span>
            Tambah {activeTab}
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-fit">
          <button 
            onClick={() => setActiveTab(UserRole.RELAWAN)}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === UserRole.RELAWAN ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Daftar Relawan
          </button>
          <button 
            onClick={() => setActiveTab(UserRole.WARGA)}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === UserRole.WARGA ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Daftar Warga
          </button>
        </div>

        {/* Database Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">ID & Profil</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">{activeTab === UserRole.RELAWAN ? 'Keahlian' : 'Alamat'}</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-200" alt={user.name} />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                        <p className="text-[10px] font-black text-slate-400 font-mono tracking-tighter uppercase">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">call</span> {user.phone}</span>
                      <span className="text-[11px] text-slate-400">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {activeTab === UserRole.RELAWAN ? user.expertise : user.address}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(user.id, user.status)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                        user.status === 'Aktif' 
                          ? 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20' 
                          : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Aktif' ? 'bg-secondary' : 'bg-slate-400'}`}></span>
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic font-medium">Data tidak ditemukan dalam database.</div>
          )}
        </div>

        {/* Modal Edit User */}
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl scale-in-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic">Edit User</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Nama</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    className="w-full border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full border-slate-200 rounded-xl font-bold"
                  />
                </div>
                {activeTab === UserRole.RELAWAN && (
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Keahlian</label>
                    <input
                      type="text"
                      value={editForm.expertise}
                      onChange={e => setEditForm({...editForm, expertise: e.target.value})}
                      className="w-full border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                )}
                {activeTab === UserRole.WARGA && (
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Alamat</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={e => setEditForm({...editForm, address: e.target.value})}
                      className="w-full border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setEditingUser(null)} className="flex-1 font-black text-slate-400 text-xs uppercase">Batal</button>
                <button onClick={handleSaveEdit} className="flex-[2] py-5 bg-red-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-red-200">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Add User */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl scale-in-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic">Tambah User Baru</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Nama</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={e => setAddForm({...addForm, name: e.target.value})}
                    className="w-full border-slate-200 rounded-xl font-bold"
                    placeholder="Nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={e => setAddForm({...addForm, email: e.target.value})}
                    className="w-full border-slate-200 rounded-xl font-bold"
                    placeholder="email@domain.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={addForm.phone}
                    onChange={e => setAddForm({...addForm, phone: e.target.value})}
                    className="w-full border-slate-200 rounded-xl font-bold"
                    placeholder="0812xxxx"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Password</label>
                  <input
                    type="password"
                    value={addForm.password}
                    onChange={e => setAddForm({...addForm, password: e.target.value})}
                    className="w-full border-slate-200 rounded-xl font-bold"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Role</label>
                  <select
                    value={addForm.role}
                    onChange={e => setAddForm({...addForm, role: e.target.value as UserRole})}
                    className="w-full border-slate-200 rounded-xl font-bold"
                  >
                    <option value={UserRole.RELAWAN}>Tim Ambulance</option>
                    <option value={UserRole.WARGA}>Warga</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.PIMPINAN}>Pimpinan</option>
                  </select>
                </div>
                {addForm.role === UserRole.RELAWAN && (
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Keahlian</label>
                    <input
                      type="text"
                      value={addForm.expertise}
                      onChange={e => setAddForm({...addForm, expertise: e.target.value})}
                      className="w-full border-slate-200 rounded-xl font-bold"
                      placeholder="Advanced Life Support"
                    />
                  </div>
                )}
                {addForm.role === UserRole.WARGA && (
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Alamat</label>
                    <input
                      type="text"
                      value={addForm.address}
                      onChange={e => setAddForm({...addForm, address: e.target.value})}
                      className="w-full border-slate-200 rounded-xl font-bold"
                      placeholder="Jl. Contoh No. 123"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowAddModal(false)} className="flex-1 font-black text-slate-400 text-xs uppercase">Batal</button>
                <button onClick={handleAddUser} className="flex-[2] py-5 bg-red-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-red-200">Tambah User</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
