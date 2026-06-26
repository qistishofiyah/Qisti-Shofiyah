/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Droplets, Shield, User, Loader2, Key, Info } from 'lucide-react';
import { AppUser } from '../types';

interface LoginPageProps {
  users: AppUser[];
  onLogin: (user: AppUser) => void;
}

export default function LoginPage({ users, onLogin }: LoginPageProps) {
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Group users by role for quick selection demo
  const adminUsers = users.filter((u) => u.role === 'Admin');
  const officerUsers = users.filter((u) => u.role === 'Petugas');
  const citizenUsers = users.filter((u) => u.role === 'User');

  const handleQuickSelect = (user: AppUser) => {
    setSelectedUser(user);
    setPassword('********'); // Pre-fill dummy password
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError('Silakan pilih salah satu profil pengguna untuk melanjutkan.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(selectedUser);
    }, 850);
  };

  return (
    <div id="login-container" className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 font-sans relative overflow-hidden">
      {/* Dynamic Water Wave Background Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse delay-700"></div>

      <div id="login-box" className="w-full max-w-5xl h-[650px] bg-slate-950/40 backdrop-blur-xl border border-blue-900/40 rounded-2xl shadow-2xl flex overflow-hidden z-10 m-4">
        {/* Left Side: Water themed promotional artwork */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 p-8 flex-col justify-between relative overflow-hidden border-r border-blue-900/30">
          {/* Wave visuals */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#0284c7" d="M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,128C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-400/30 shadow-lg shadow-blue-500/10">
                <Droplets className="w-6 h-6 text-blue-400 animate-bounce" />
              </div>
              <span className="font-bold tracking-wider text-sm text-blue-400">PRESISI AIR-99</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-100 to-cyan-300 bg-clip-text text-transparent mt-12">
              Modul Monitoring Respons & Waktu Tanggap krisis Air
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Sistem terintegrasi untuk pemantauan, pelaporan, penugasan, dan analisis waktu respons penanganan krisis air di wilayah Provinsi Jawa Barat.
            </p>
          </div>

          <div className="z-10 space-y-4">
            <div className="p-4 bg-blue-950/40 border border-blue-800/30 rounded-xl text-xs text-blue-300 flex gap-3">
              <Info className="w-5 h-5 flex-shrink-0 text-blue-400" />
              <div>
                <span className="font-semibold block mb-0.5">Suku Dinas Air & Lingkungan:</span>
                Respons tanggap darurat rata-rata ditargetkan di bawah 120 menit sejak laporan masuk dan diverifikasi.
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Lokasi server: JAKARTA-MAIN-NODE-01<br />
              Sistem Rilis v2.4.0 • 2026 AD
            </div>
          </div>
        </div>

        {/* Right Side: Quick Login Form */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Masuk ke Dashboard</h2>
              <p className="text-xs text-slate-400">Pilih salah satu akun demo di bawah ini untuk mengakses dashboard spesifik peran.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Role Quick Selectors */}
              <div className="space-y-4">
                {/* 1. Admin Account */}
                <div>
                  <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase block mb-2">1. Akun Administrator (Manajer)</span>
                  <div className="grid grid-cols-1 gap-2">
                    {adminUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickSelect(u)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          selectedUser?.id === u.id
                            ? 'bg-blue-950/50 border-blue-500 shadow-md shadow-blue-500/5'
                            : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/70 hover:border-slate-700'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-blue-500/20" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-200">{u.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{u.email} • {u.assignedArea}</p>
                        </div>
                        <div className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                          ADMIN
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Petugas Accounts */}
                <div>
                  <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase block mb-2">2. Akun Petugas Teknis / Lapangan</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {officerUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickSelect(u)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                          selectedUser?.id === u.id
                            ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/5'
                            : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/70 hover:border-slate-700'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-cyan-500/20" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-slate-200 truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{u.assignedArea}</p>
                        </div>
                        <div className="px-1.5 py-0.5 text-[9px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
                          PETUGAS
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. User Citizen Accounts */}
                <div>
                  <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase block mb-2">3. Akun Pengguna / Pelapor Umum</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {citizenUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickSelect(u)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                          selectedUser?.id === u.id
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/5'
                            : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/70 hover:border-slate-700'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-indigo-500/20" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-slate-200 truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{u.assignedArea || 'Warga Sipil'}</p>
                        </div>
                        <div className="px-1.5 py-0.5 text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                          WARGA
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Password Input (Read-only for Demo Easy Login) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-400" /> Sandi Autentikasi
                  </label>
                  <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 font-mono">
                    Mode Demo Otomatis
                  </span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!selectedUser}
                  className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-colors placeholder-slate-600"
                  placeholder="Pilih pengguna terlebih dahulu..."
                />
              </div>

              {error && (
                <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 flex gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedUser}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-medium py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Mempersiapkan Lingkungan Kerja...</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>Masuk sebagai {selectedUser ? selectedUser.name : 'Pihak Berwenang'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center text-[11px] text-slate-500 mt-6 border-t border-slate-900 pt-4">
            Keamanan dijamin oleh Pusat Informasi Krisis Air Provinsi Jawa Barat &copy; 2026. Hak Cipta Dilindungi.
          </div>
        </div>
      </div>
    </div>
  );
}
