/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Droplets, 
  LayoutDashboard, 
  Radio, 
  FileText, 
  Users, 
  LogOut, 
  ShieldAlert, 
  Compass, 
  User as UserIcon,
  HelpCircle,
  Bell
} from 'lucide-react';
import { AppUser, UserRole } from '../types';

interface SidebarProps {
  currentUser: AppUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  unreadNotificationsCount: number;
  openNotifications: () => void;
}

export default function Sidebar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onLogout,
  unreadNotificationsCount,
  openNotifications
}: SidebarProps) {
  
  // Custom navigation based on role
  const getNavItems = (role: UserRole) => {
    const base = [];

    // Only Admin can see "Ringkasan Dashboard"
    if (role === 'Admin') {
      base.push({ id: 'overview', label: 'Ringkasan Dashboard', icon: LayoutDashboard });
    }

    base.push(
      { id: 'monitoring', label: 'Monitor Real-Time', icon: Radio },
      { id: 'reports', label: role === 'User' ? 'Laporan Saya' : 'Kelola Laporan', icon: FileText }
    );

    if (role === 'Admin') {
      base.push({ id: 'users', label: 'Manajemen Pengguna', icon: Users });
    }

    base.push({ id: 'about', label: 'Tentang & SLA', icon: HelpCircle });

    return base;
  };

  const navItems = getNavItems(currentUser.role);

  // Background gradient map for the role badges
  const roleBadges = {
    Admin: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    Petugas: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    User: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  };

  return (
    <aside id="sidebar-navigation" className="w-[280px] bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 z-30 font-sans">
      
      {/* Sidebar Header / Branding */}
      <div>
        <div className="p-6 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Droplets className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-[15px] leading-tight tracking-tight uppercase">AirSiaga</h1>
              <span className="text-[10px] font-medium text-blue-400 tracking-wide font-mono block">SISTEM MONITORING</span>
            </div>
          </div>
          
          {/* Internal Notification Indicator in Sidebar */}
          <button 
            type="button"
            onClick={openNotifications}
            className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950"></span>
            )}
          </button>
        </div>

        {/* Logged In Profile Card */}
        <div className="p-4 mx-4 mt-5 bg-slate-900/40 rounded-xl border border-slate-800/40 flex items-center gap-3">
          <img 
            src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-full object-cover border border-blue-500/20 shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xs text-slate-200 truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${roleBadges[currentUser.role]}`}>
                {currentUser.role.toUpperCase()}
              </span>
              <span className="text-[9px] text-slate-500 truncate max-w-[100px]" title={currentUser.assignedArea}>
                {currentUser.assignedArea ? currentUser.assignedArea.split(',')[0] : 'Warga Umum'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="px-3 mt-6 space-y-1">
          <span className="px-4 text-[10px] font-semibold text-slate-600 uppercase tracking-widest block mb-2">MENU UTAMA</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/15' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-900 space-y-3">
        {/* Help/System Info Widget */}
        <div className="p-3.5 bg-blue-950/20 border border-blue-900/10 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 tracking-wider">KONDISI OPERASIONAL</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Semua subsistem pemantauan krisis air online. Waktu respons rata-rata divalidasi sistem.
          </p>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors border border-transparent hover:border-rose-500/20 cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4" />
            Ganti / Keluar Akun
          </span>
          <span className="text-[9px] font-mono opacity-50">ESC</span>
        </button>
      </div>
    </aside>
  );
}
