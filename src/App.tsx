/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Droplets, 
  User as UserIcon, 
  RefreshCw, 
  MessageSquare, 
  X, 
  CheckCircle, 
  Trash2,
  Info
} from 'lucide-react';

import { WaterReport, AppUser, ActivityLog, PushNotification } from './types';
import { initialUsers, initialReports, initialLogs, initialNotifications } from './mockData';

// Subcomponents
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
import PetugasDashboard from './components/PetugasDashboard';
import UserDashboard from './components/UserDashboard';
import MonitoringPage from './components/MonitoringPage';
import UserManagement from './components/UserManagement';
import AboutPage from './components/AboutPage';

export default function App() {
  
  // 1. Core Persistent States from localStorage
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('krisis_air_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [reports, setReports] = useState<WaterReport[]>(() => {
    const saved = localStorage.getItem('krisis_air_reports');
    if (saved) return JSON.parse(saved);
    return initialReports;
  });

  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('krisis_air_users');
    let list: AppUser[] = initialUsers;
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        list = initialUsers;
      }
    }
    // Hapus Haidar Yahya dari data awal dan data tersimpan jika ada
    return list.filter(u => {
      const uName = (u.name || '').toLowerCase();
      return !(uName.includes('haidar') && uName.includes('yahya'));
    });
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('krisis_air_logs');
    if (saved) return JSON.parse(saved);
    return initialLogs;
  });

  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    const saved = localStorage.getItem('krisis_air_notifications');
    if (saved) return JSON.parse(saved);
    return initialNotifications;
  });

  const [activeTab, setActiveTab] = useState(() => {
    const savedUser = localStorage.getItem('krisis_air_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'Admin') return 'overview';
      } catch (e) {
        // ignore
      }
    }
    return 'reports';
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, message: string} | null>(null);

  // Sync to localStorage on mutations
  useEffect(() => {
    localStorage.setItem('krisis_air_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('krisis_air_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('krisis_air_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('krisis_air_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('krisis_air_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('krisis_air_user');
    }
  }, [currentUser]);

  // Handle active role tab switching edge cases
  useEffect(() => {
    if (currentUser) {
      // If client switches role, make sure they don't get stuck on admin/users page
      if (currentUser.role !== 'Admin' && activeTab === 'users') {
        setActiveTab('reports');
      }
      // If client is not Admin, they don't have access to overview (Ringkasan Dashboard) anymore
      if (currentUser.role !== 'Admin' && activeTab === 'overview') {
        setActiveTab('reports');
      }
    }
  }, [currentUser, activeTab]);

  // Helper trigger - custom push notifications Toast inside the app
  const triggerToast = (title: string, message: string) => {
    setToastMessage({ title, message });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 2. Action Handlers (CRUD operations for Reports, Users, Logs)
  
  // Submit raw report (used by either Petugas or User)
  const handleSubmitNewReport = (reportData: Omit<WaterReport, 'id' | 'ticketNumber' | 'createdAt'>) => {
    const ticketYear = new Date().getFullYear();
    const count = reports.length + 1;
    const ticketNumber = `TKT-${ticketYear}-${String(count).padStart(3, '0')}`;
    
    const newReport: WaterReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      ticketNumber,
      createdAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);

    // Create System notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Laporan Baru Terbit',
      message: `Tiket ${ticketNumber} (${reportData.category}) terdaftar di daerah ${reportData.location}.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: reportData.severity === 'Darurat' ? 'error' : 'info',
      relatedTicketId: newReport.id
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Create logger entry
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'anonymous',
      userName: currentUser?.name || 'Masyarakat Umum',
      userRole: currentUser?.role || 'User',
      action: 'Buat Laporan Baru',
      details: `Mendaftarkan tiket krisis air ${ticketNumber} tingkat ${reportData.severity}`
    };
    setLogs(prev => [newLog, ...prev]);

    triggerToast('Sukses Mengirim Laporan', `Laporan ${ticketNumber} berhasil didaftarkan dan segera ditindaklanjuti.`);
  };

  // Update Status and record response times / SLA counters
  const handleUpdateStatus = (id: string, nextStatus: WaterReport['status'], resolutionNotes?: string) => {
    setReports(prev => prev.map(report => {
      if (report.id !== id) return report;

      const updated = { ...report, status: nextStatus };
      const now = new Date().toISOString();

      // Handle transitions
      if (nextStatus === 'Verifikasi') {
        updated.verifiedAt = now;
        // Calculate Waktu Tanggap / Response time in minutes
        const diffMs = Date.parse(now) - Date.parse(report.createdAt);
        updated.responseTimeMinutes = Math.max(1, Math.round(diffMs / 60000));
      } else if (nextStatus === 'Ditugaskan') {
        updated.assignedAt = now;
      } else if (nextStatus === 'Sedang Ditangani') {
        updated.processingAt = now;
      } else if (nextStatus === 'Selesai') {
        updated.resolvedAt = now;
        if (resolutionNotes) {
          updated.resolutionNotes = resolutionNotes;
        }

        // Calculate whole total ticket handling duration
        const totalDiffMs = Date.parse(now) - Date.parse(report.createdAt);
        updated.totalResponseTimeMinutes = Math.max(5, Math.round(totalDiffMs / 60000));

        if (report.processingAt) {
          const procDiffMs = Date.parse(now) - Date.parse(report.processingAt);
          updated.handlingTimeMinutes = Math.max(2, Math.round(procDiffMs / 60000));
        }
      }

      // Generate notification popup
      const newNotif: PushNotification = {
        id: `notif-${Date.now()}`,
        title: 'Status Tiket Diperbarui',
        message: `Tiket ${report.ticketNumber} sekarang diprosedur ke status [${nextStatus}].`,
        timestamp: now,
        isRead: false,
        type: nextStatus === 'Selesai' ? 'success' : 'info',
        relatedTicketId: id
      };
      setNotifications(prev => [newNotif, ...prev]);

      // Create logger entry
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: now,
        userId: currentUser?.id || 'anonymous',
        userName: currentUser?.name || 'Petugas Lapangan',
        userRole: currentUser?.role || 'Petugas',
        action: 'Memperbarui Status',
        details: `Mengubah laporan ${report.ticketNumber} ke status ${nextStatus}`
      };
      setLogs(prev => [newLog, ...prev]);

      triggerToast('Tiket Diperbarui', `Laporan ${report.ticketNumber} sukses dialihkan ke status ${nextStatus}.`);

      return updated;
    }));
  };

  // Assign Officer to a report
  const handleAssignOfficer = (id: string, officerName: string) => {
    setReports(prev => prev.map(report => {
      if (report.id !== id) return report;

      const now = new Date().toISOString();
      const updated = { ...report, assignedOfficer: officerName, assignedAt: now };

      // Logger
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: now,
        userId: currentUser?.id || 'admin',
        userName: currentUser?.name || 'Administrator',
        userRole: 'Admin',
        action: 'Penugasan Petugas',
        details: `Menugaskan ${officerName} untuk tiket krisis air ${report.ticketNumber}`
      };
      setLogs(prev => [newLog, ...prev]);

      return updated;
    }));
  };

  // Delete report CRUD
  const handleDeleteReport = (id: string) => {
    const reportToDelete = reports.find(r => r.id === id);
    if (!reportToDelete) return;

    setReports(prev => prev.filter(r => r.id !== id));

    // Logger
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrator',
      userRole: currentUser?.role || 'Admin',
      action: 'Hapus Laporan',
      details: `Menghapus tiket laporan ${reportToDelete.ticketNumber}`
    };
    setLogs(prev => [newLog, ...prev]);
    
    triggerToast('Laporan Dihapus', `Laporan ${reportToDelete.ticketNumber} telah dihapus.`);
  };

  // User Management actions (Admin Only)
  const handleAddUser = (userData: Omit<AppUser, 'id'>) => {
    const newUser: AppUser = {
      ...userData,
      id: `u-${Date.now()}`
    };

    setUsers(prev => [...prev, newUser]);

    // Logger
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrator',
      userRole: 'Admin',
      action: 'Tambah Pengguna',
      details: `Membuat akun pengguna baru bernama ${userData.name} berperan ${userData.role}`
    };
    setLogs(prev => [newLog, ...prev]);

    triggerToast('Pengguna Ditambahkan', `${userData.name} berhasil terdaftar.`);
  };

  const handleUpdateUser = (id: string, updatedData: Partial<AppUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));

    // If updating current user, sync immediately
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
    }

    // Logger
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrator',
      userRole: 'Admin',
      action: 'Update Pengguna',
      details: `Memperbarui info profil/perizinan pengguna id ${id}`
    };
    setLogs(prev => [newLog, ...prev]);

    triggerToast('Profil Pengguna Diupdate', 'Data berhasil diperbaharui.');
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;

    setUsers(prev => prev.filter(u => u.id !== id));

    // Logger
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrator',
      userRole: 'Admin',
      action: 'Hapus Pengguna',
      details: `Menghapus akun pengguna ${userToDelete.name}`
    };
    setLogs(prev => [newLog, ...prev]);

    triggerToast('Pengguna Dihapus', `Akun ${userToDelete.name} telah dikeluarkan dari sistem.`);
  };

  // Reset database values easily
  const resetDatabaseToDefault = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang seluruh database ke data bawaan demo?')) {
      localStorage.removeItem('krisis_air_reports');
      localStorage.removeItem('krisis_air_users');
      localStorage.removeItem('krisis_air_logs');
      localStorage.removeItem('krisis_air_notifications');
      setReports(initialReports);
      setUsers(initialUsers);
      setLogs(initialLogs);
      setNotifications(initialNotifications);
      triggerToast('Database Berhasil Disetel Ulang', 'Seluruh data operasional dikembalikan ke setelan awal pabrikan.');
    }
  };

  // 3. Navigation Render
  const renderTabContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case 'overview':
        if (currentUser.role === 'Admin') {
          return (
            <AdminDashboard 
              reports={reports} 
              activityLogs={logs} 
              users={users} 
              onNavigateToTab={setActiveTab}
              onQuickVerifyReport={(id) => handleUpdateStatus(id, 'Verifikasi')}
            />
          );
        } else if (currentUser.role === 'Petugas') {
          return (
            <PetugasDashboard 
              currentUser={currentUser}
              reports={reports}
              onSubmitNewReport={handleSubmitNewReport}
              onUpdateStatus={handleUpdateStatus}
              onDeleteReport={handleDeleteReport}
            />
          );
        } else {
          return (
            <UserDashboard 
              currentUser={currentUser}
              reports={reports}
              onSubmitNewReport={handleSubmitNewReport}
              onDeleteReport={handleDeleteReport}
            />
          );
        }
      
      case 'monitoring':
        return (
          <MonitoringPage 
            reports={reports}
            currentUser={currentUser}
            onUpdateStatus={handleUpdateStatus}
            onAssignOfficer={handleAssignOfficer}
            availableOfficers={users.filter(u => u.role === 'Petugas' && u.status === 'Aktif')}
            onDeleteReport={handleDeleteReport}
          />
        );

      case 'reports':
        if (currentUser.role === 'User') {
          return (
            <UserDashboard 
              currentUser={currentUser}
              reports={reports}
              onSubmitNewReport={handleSubmitNewReport}
              onDeleteReport={handleDeleteReport}
            />
          );
        }
        return (
          <PetugasDashboard 
            currentUser={currentUser}
            reports={reports}
            onSubmitNewReport={handleSubmitNewReport}
            onUpdateStatus={handleUpdateStatus}
            onDeleteReport={currentUser.role === 'Admin' || currentUser.role === 'Petugas' ? handleDeleteReport : undefined}
          />
        );

      case 'users':
        if (currentUser.role !== 'Admin') return <div className="p-6 text-xs text-slate-500">Akses Ditolak.</div>;
        return (
          <UserManagement 
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );

      case 'about':
        return <AboutPage />;

      default:
        return (
          <div className="p-6">
            <p className="text-slate-400">Section {activeTab} sedang dipersiapkan.</p>
          </div>
        );
    }
  };

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    // Default appropriate landing tabs
    if (user.role === 'Admin') {
      setActiveTab('overview');
    } else {
      setActiveTab('reports');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsNotificationsOpen(false);
  };

  // Notification read handler
  const unreadNotifications = notifications.filter(n => !n.isRead);
  
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // If not logged in, show beautiful login screen
  if (!currentUser) {
    return (
      <LoginPage 
        users={users} 
        onLogin={handleLogin} 
      />
    );
  }

  return (
    <div className="flex bg-slate-900 text-slate-100 min-h-screen relative overflow-hidden font-sans">
      
      {/* 1. Lateral Navigation Drawer component */}
      <Sidebar 
        currentUser={currentUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        unreadNotificationsCount={unreadNotifications.length}
        openNotifications={() => setIsNotificationsOpen(prev => !prev)}
      />

      {/* 2. Main Desktop panel area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative h-screen">
        
        {/* Top Floating Mini bar containing system reset for test evaluation */}
        <div className="bg-slate-950/80 border-b border-slate-900 px-6 py-2 flex justify-between items-center z-15 backdrop-blur">
          <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
            <span className="font-bold text-blue-400 font-mono">ROLE AKTIF:</span>
            <span>Anda sedang login sebagai <strong className="text-slate-200">{currentUser.name} ({currentUser.role})</strong></span>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={resetDatabaseToDefault}
              className="text-[10.5px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 bg-slate-900 hover:bg-slate-850 px-2.5 py-1.5 rounded-lg border border-slate-800 transition-colors uppercase font-bold tracking-tight cursor-pointer"
              title="Reset Sandbox"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Data Demo
            </button>
          </div>
        </div>

        {/* Dynamic subview */}
        <div className="flex-1">
          {renderTabContent()}
        </div>

        {/* 3. Sliding sidebar notification center panel */}
        {isNotificationsOpen && (
          <div className="fixed top-0 right-0 h-screen w-80 bg-slate-950 border-l border-slate-800 shadow-2xl z-40 p-5 flex flex-col justify-between font-sans">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4.5 h-4.5 text-blue-400" />
                  <h3 className="font-bold text-sm text-slate-200">Log Notifikasi Push</h3>
                </div>
                
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {unreadNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllNotificationsRead}
                  className="text-[10px] text-blue-400 hover:underline font-semibold w-full text-right block cursor-pointer"
                >
                  Tandai Semua Sudah Dibaca
                </button>
              )}

              {/* Notification items */}
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-600 text-xs">
                  Tidak ada pemberitahuan baru.
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-3 rounded-lg border text-xs relative ${
                        !notif.isRead ? 'bg-blue-950/20 border-blue-900/60' : 'bg-slate-900/40 border-slate-900/60'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-200">{notif.title}</span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-normal text-[11px]">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleClearNotifications}
              className="w-full bg-slate-900 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 font-semibold py-2 rounded-xl text-xs border border-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Bersihkan Riwayat Notifikasi
            </button>
          </div>
        )}

        {/* 4. Instant push-notification Toast popup (Simulated bottom right Desk notify) */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 max-w-sm bg-slate-950/95 backdrop-blur border border-blue-500 text-slate-100 p-4.5 rounded-2xl shadow-2xl z-50 animate-bounce flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400">
              <CheckCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs text-white leading-tight mb-0.5">{toastMessage.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{toastMessage.message}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      </main>

    </div>
  );
}
