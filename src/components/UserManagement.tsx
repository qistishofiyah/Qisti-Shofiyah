/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, UserPlus, ShieldAlert, Check, X, Shield, Mail, Map, Trash, Edit2 } from 'lucide-react';
import { AppUser, UserRole } from '../types';

interface UserManagementProps {
  users: AppUser[];
  onAddUser: (user: Omit<AppUser, 'id'>) => void;
  onUpdateUser: (id: string, updatedData: Partial<AppUser>) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserManagement({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: UserManagementProps) {
  
  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Petugas');
  const [assignedArea, setAssignedArea] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Submit Handler
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Nama dan Email wajib diisi!');
      return;
    }

    if (editingUser) {
      // Update existing
      onUpdateUser(editingUser.id, {
        name,
        email,
        role,
        assignedArea,
        status
      });
    } else {
      // Add new user
      onAddUser({
        name,
        email,
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        assignedArea: assignedArea || 'Bandung / Jawa Barat',
        status
      });
    }

    // Reset and close
    resetForm();
  };

  const startEdit = (u: AppUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setAssignedArea(u.assignedArea || '');
    setStatus(u.status);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('Petugas');
    setAssignedArea('');
    setStatus('Aktif');
    setIsModalOpen(false);
  };

  return (
    <div id="user-management-container" className="p-6 space-y-6 font-sans bg-slate-900 min-h-screen text-slate-100 pb-16">
      
      {/* Header section with User Action triggers */}
      <header className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase block w-fit mb-1.5">
            KONTROL SISTEM
          </span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Manajemen Pengguna & Pengaturan Hak Akses
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mendaftarkan user, mengatur hak akses penugasan daerah operasional, dan meninjau status penugasan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Tambah Pengguna Baru
        </button>
      </header>

      {/* Users table list visualization */}
      <section className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-900">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-blue-400" /> Pengguna Terdaftar ({users.length} Akun)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-900 text-slate-450 uppercase font-bold tracking-wider">
                <th className="p-4">Nama & Profil</th>
                <th className="p-4">Email</th>
                <th className="p-4">Hak Akses Role</th>
                <th className="p-4">Wilayah Operasional / Tugas</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {users.map((u) => {
                const roleBadges = {
                  Admin: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                  Petugas: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
                  User: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
                };

                return (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img 
                        src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"} 
                        alt={u.name} 
                        className="w-9 h-9 rounded-full object-cover border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-bold text-slate-200">{u.name}</span>
                    </td>
                    
                    <td className="p-4 text-slate-400 font-mono">
                      {u.email}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded border font-semibold text-[10px] ${roleBadges[u.role]}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-slate-350">
                      {u.assignedArea || 'Seluruh Jawa Barat'}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10.5px] font-bold ${
                        u.status === 'Aktif' ? 'text-green-400' : 'text-slate-500'
                      }`}>
                        {u.status === 'Aktif' ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                            <span>Nonaktif</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(u)}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 p-1.5 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                          title="Edit Pengguna"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          type="button"
                          disabled={u.email === 'admin@airkrisis.go.id'}
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${u.name}?`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          className="bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 p-1.5 rounded-lg border border-slate-800 hover:border-rose-900 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Hapus Pengguna"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* USER MANAGEMENT DIALOG FORM (CREATE / EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            
            <button
              onClick={() => resetForm()}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Shield className="text-blue-400 w-5 h-5" /> 
                {editingUser ? 'Edit Detail Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Atur otorisasi hak masuk, email resmi, dan status administratif sitem.
              </p>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-4 pt-2">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Nama Penuh</label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Akhyar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Alamat Email Resmi</label>
                <input
                  type="email"
                  placeholder="Contoh: akhyar@airkrisis.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Hak Akses Sistem</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Admin">Admin (Otoritas Penuh)</option>
                  <option value="Petugas">Petugas Lapangan (Operasional)</option>
                  <option value="User">User Umum (Masyarakat Pelapor)</option>
                </select>
              </div>

              {/* Assigned area */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Wilayah Penugasan / Pemukiman</label>
                <input
                  type="text"
                  placeholder="Contoh: Gg. Gurame, Coblong"
                  value={assignedArea}
                  onChange={(e) => setAssignedArea(e.target.value)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* status */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Status Keaktifan Akun</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="flex-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg transition-colors cursor-pointer"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Buat User'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
