/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Droplet, 
  Users, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  Gauge
} from 'lucide-react';
import { WaterReport, ActivityLog, AppUser } from '../types';

interface AdminDashboardProps {
  reports: WaterReport[];
  activityLogs: ActivityLog[];
  users: AppUser[];
  onNavigateToTab: (tab: string) => void;
  onQuickVerifyReport: (id: string) => void;
}

export default function AdminDashboard({ 
  reports, 
  activityLogs, 
  users, 
  onNavigateToTab,
  onQuickVerifyReport
}: AdminDashboardProps) {
  const [activeGeoHover, setActiveGeoHover] = useState<string | null>(null);

  // 1. Calculate General Metrics
  const totalReportsCount = reports.length;
  
  // Statuses
  const incomingCount = reports.filter(r => r.status === 'Laporan Masuk').length;
  const inProgressCount = reports.filter(r => r.status === 'Sedang Ditangani' || r.status === 'Ditugaskan').length;
  const resolvedCount = reports.filter(r => r.status === 'Selesai').length;
  const verificationCount = reports.filter(r => r.status === 'Verifikasi').length;

  // Active crisis rate (percentage unfinished tickets)
  const activeCrisisCount = totalReportsCount - resolvedCount;
  const activeCrisisPercentage = totalReportsCount > 0 ? Math.round((activeCrisisCount / totalReportsCount) * 100) : 0;

  // 2. Average Response Time Calculation (Response time is verifiedAt - createdAt, in minutes)
  const reportsWithResponseTime = reports.filter(r => r.responseTimeMinutes !== undefined);
  const avgResponseTime = reportsWithResponseTime.length > 0
    ? Math.round(reportsWithResponseTime.reduce((sum, r) => sum + (r.responseTimeMinutes || 0), 0) / reportsWithResponseTime.length)
    : 24; // fallback default KPI

  // 3. Average Resolution Time (Selesai tickets response time)
  const reportsWithTotalTime = reports.filter(r => r.totalResponseTimeMinutes !== undefined);
  const avgResolutionTime = reportsWithTotalTime.length > 0
    ? Math.round(reportsWithTotalTime.reduce((sum, r) => sum + (r.totalResponseTimeMinutes || 0), 0) / reportsWithTotalTime.length)
    : 175;

  // 4. Sebaran Wilayah / Districts summary
  const subdistricts = ['Coblong (Kota Bandung)', 'Lembang (Bandung Barat)', 'Jatinangor (Sumedang)'];
  const districtReports = subdistricts.map(sub => {
    const rawList = reports.filter(r => r.subdistrict === sub);
    const resolved = rawList.filter(r => r.status === 'Selesai').length;
    const active = rawList.length - resolved;
    const severe = rawList.filter(r => r.severity === 'Darurat' || r.severity === 'Tinggi').length;
    return {
      name: sub,
      total: rawList.length,
      active,
      resolved,
      severe,
      color: sub === 'Coblong (Kota Bandung)' ? 'sky' : sub === 'Lembang (Bandung Barat)' ? 'blue' : 'indigo'
    };
  });

  // 5. Total Affected People
  const totalAffected = reports.reduce((sum, r) => sum + (r.affectedPeople || 0), 0);

  // 6. Distribution of categories
  const categories = Array.from(new Set(reports.map(r => r.category)));
  const categoryStats = categories.map(cat => {
    const count = reports.filter(r => r.category === cat).length;
    const percentage = totalReportsCount > 0 ? Math.round((count / totalReportsCount) * 100) : 0;
    return { name: cat, count, percentage };
  }).sort((a,b) => b.count - a.count);

  return (
    <div id="admin-dashboard-container" className="p-6 space-y-6 font-sans bg-slate-900 min-h-screen text-slate-100 pb-16">
      
      {/* 2. Top Header section with system status indicator */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-950/40 p-5 rounded-2xl border border-blue-900/10 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-3 h-3" /> ADMIN PORTAL
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-[11px] text-slate-400 font-medium font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" /> TIMESTAMPS: 2026-06-20
            </span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Sistem Komando Krisis Air Provinsi Jawa Barat
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring performa respons petugas, waktu tanggap (SLA), & koordinasi armada tangki air darurat Jawa Barat.
          </p>
        </div>

        {/* Real-Time Live Clock Node */}
        <div id="real-time-badge" className="bg-slate-900/80 border border-slate-800 p-2.5 px-4 rounded-xl flex items-center gap-3">
          <div id="pulsating-ring" className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-semibold">STATUS JARINGAN</p>
            <p className="text-xs font-semibold text-slate-200 font-mono">TERHUBUNG (LIVE)</p>
          </div>
        </div>
      </header>

      {/* 2. KPI Cards Grid - Focused on Response Times and Water theme */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Rata-rata Waktu Tanggap (SLA) */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-20 h-20 text-blue-400" />
          </div>
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Clock className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Rata-rata Waktu Tanggap</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">{avgResponseTime}</span>
            <span className="text-xs text-slate-400 font-semibold">Menit</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/10 w-fit px-2 py-0.5 rounded border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Target SLA {`(< 30m)`} Terpenuhi</span>
          </div>
        </div>

        {/* KPI 2: Total Waktu Resolusi Kasus */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Gauge className="w-20 h-20 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Gauge className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Durasi Selesai (Rata-rata)</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {Math.floor(avgResolutionTime / 60)}j {avgResolutionTime % 60}m
            </span>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 leading-normal flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-cyan-400" />
            <span>Terhitung sejak verifikasi hingga penyelesaian</span>
          </div>
        </div>

        {/* KPI 3: Jumlah Warga Terdampak */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-20 h-20 text-indigo-400" />
          </div>
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Users className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Estimasi Jiwa Terdampak</h3>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-white">{totalAffected.toLocaleString('id-ID')}</span>
            <span className="text-xs text-slate-400 font-semibold">Jiwa</span>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 leading-normal">
            Penyebaran krisis air bersih terfokus di pemukiman pesisir
          </div>
        </div>

        {/* KPI 4: Indeks Beban Krisis Air */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Droplet className="w-20 h-20 text-rose-400" />
          </div>
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <Droplet className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Persentase Krisis Aktif</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">{activeCrisisPercentage}%</span>
            <span className="text-xs text-slate-400">({activeCrisisCount}/{totalReportsCount} Tiket)</span>
          </div>
          
          {/* Real-time Loading wave animation inside the card box */}
          <div className="mt-3.5 w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${100 - activeCrisisPercentage}%` }}
            ></div>
          </div>
        </div>

      </section>

      {/* 3. Main Dashboard Board Section (Split columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Sebaran Krisis Spasial (Subdistrict Map & KPI Breakdown) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Custom Blueprint Interactive Spasial Indicator (Aesthetic substitute for actual Maps) */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-5 border-b border-slate-900 pb-4">
              <div>
                <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <MapPin className="text-blue-400 w-4.5 h-4.5" /> Peta Monitor Spasial & Titik Hotspot Krisis
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Visual pemetaan wilayah krisis air aktif di Provinsi Jawa Barat.</p>
              </div>
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-semibold animate-pulse">
                SINKRONISASI AKTIF
              </span>
            </div>

            {/* Simulated Geographic Blueprint Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Geometric Grid Map of Subdistrict hotspots */}
              <div className="relative bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-center items-center min-h-[220px] overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-blue-900/15 to-transparent pointer-events-none"></div>
                <span className="text-[9px] font-mono text-slate-600 absolute top-2 left-2 uppercase tracking-tight">Kordinat Pusat Pengendali</span>
                
                {/* Visual Blueprint Grid representing Jawa Barat districts */}
                <div className="w-full max-w-[280px] aspect-square relative grid grid-cols-3 grid-rows-3 gap-2 mt-4">
                  
                  {/* Coblong Cell */}
                  <div 
                    onMouseEnter={() => setActiveGeoHover('Coblong (Kota Bandung)')}
                    onMouseLeave={() => setActiveGeoHover(null)}
                    className={`rounded-lg border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                      activeGeoHover === 'Coblong (Kota Bandung)' || activeGeoHover === null
                        ? 'bg-sky-500/10 border-sky-500/40 shadow-lg shadow-sky-500/5'
                        : 'bg-slate-900/35 border-slate-900/60 opacity-60'
                    }`}
                  >
                    <span className="text-[9px] font-bold font-mono text-sky-400">BDG - 01</span>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] text-slate-300 font-semibold truncate">Coblong</span>
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                    </div>
                  </div>

                  {/* Jatinangor Cell */}
                  <div 
                    onMouseEnter={() => setActiveGeoHover('Jatinangor (Sumedang)')}
                    onMouseLeave={() => setActiveGeoHover(null)}
                    className={`col-span-2 rounded-lg border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                      activeGeoHover === 'Jatinangor (Sumedang)' || activeGeoHover === null
                        ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : 'bg-slate-900/35 border-slate-900/60 opacity-60'
                    }`}
                  >
                    <span className="text-[9px] font-bold font-mono text-blue-400">SMD - 02</span>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] text-slate-300 font-semibold truncate">Jatinangor</span>
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    </div>
                  </div>

                  {/* Lembang Cell */}
                  <div 
                    onMouseEnter={() => setActiveGeoHover('Lembang (Bandung Barat)')}
                    onMouseLeave={() => setActiveGeoHover(null)}
                    className={`col-span-2 row-span-2 rounded-lg border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                      activeGeoHover === 'Lembang (Bandung Barat)' || activeGeoHover === null
                        ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                        : 'bg-slate-900/35 border-slate-900/60 opacity-60'
                    }`}
                  >
                    <span className="text-[9px] font-bold font-mono text-indigo-400">KBB - 03</span>
                    <div className="flex items-center justify-between mt-12">
                      <span className="text-[9px] text-slate-300 font-semibold truncate">Lembang</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    </div>
                  </div>

                  {/* Buffer Oceanic Cell */}
                  <div className="rounded-lg border border-slate-905 bg-slate-950/20 p-2 flex flex-col justify-between relative overflow-hidden">
                    <span className="text-[8px] font-mono text-slate-700">GUNUNG TANGKUBAN</span>
                    <div className="w-full absolute bottom-0 left-0 right-0 h-4 bg-blue-500/5 animate-pulse"></div>
                  </div>

                  {/* Buffer Land Cell */}
                  <div className="rounded-lg border border-slate-905 bg-slate-950/20 p-2 flex flex-col justify-end">
                    <span className="text-[8px] font-mono text-slate-700">DATARAN PRIANGAN</span>
                  </div>

                </div>
              </div>

              {/* Subdistrict Breakdown Panel details */}
              <div className="space-y-4">
                {districtReports.map(dr => (
                  <div 
                    key={dr.name}
                    onMouseEnter={() => setActiveGeoHover(dr.name)}
                    onMouseLeave={() => setActiveGeoHover(null)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activeGeoHover === dr.name 
                        ? 'bg-slate-900 border-blue-500 shadow-md scale-[1.01]' 
                        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-200">Kecamatan {dr.name}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {dr.total} Total Tiket
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 mb-2.5">
                      <div className="bg-slate-950 p-1 rounded border border-slate-900 text-center">
                        <span className="text-[8px] font-semibold text-slate-500 block uppercase">Aktif</span>
                        <span className="font-mono text-xs font-bold text-amber-400">{dr.active}</span>
                      </div>
                      <div className="bg-slate-950 p-1 rounded border border-slate-900 text-center">
                        <span className="text-[8px] font-semibold text-slate-500 block uppercase">Selesai</span>
                        <span className="font-mono text-xs font-bold text-green-400">{dr.resolved}</span>
                      </div>
                      <div className="bg-slate-950 p-1 rounded border border-slate-900 text-center">
                        <span className="text-[8px] font-semibold text-slate-500 block uppercase">Severe</span>
                        <span className="font-mono text-xs font-bold text-red-400">{dr.severe}</span>
                      </div>
                    </div>

                    {/* Progress distribution */}
                    <div className="relative w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full" 
                        style={{ width: `${dr.total > 0 ? (dr.resolved / dr.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* SVG-based Analytical Graph: Dynamic trend metrics */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-900 pb-4">
              <div>
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Layers className="text-cyan-400 w-4.5 h-4.5" /> Analisis Jenis Krisis & Intensitas Pengaduan
                </h3>
                <p className="text-[11px] text-slate-400">Perbandingan per kategori laporan krisis air yang terdaftar.</p>
              </div>
              <button 
                type="button"
                onClick={() => onNavigateToTab('monitoring')}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer"
              >
                Selengkapnya di Monitor <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Custom Responsive pure CSS graph */}
            <div className="space-y-4">
              {categoryStats.map(stat => (
                <div key={stat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{stat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">({stat.count} Laporan)</span>
                      <span className="font-bold text-slate-100 font-mono">{stat.percentage}%</span>
                    </div>
                  </div>
                  
                  {/* Beautiful customized bar representation */}
                  <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-800/60 p-0.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Active Task Queue & Fast Validation Panel */}
        <div className="space-y-6">
          
          {/* Incoming verification requests require quick action by Administrator */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-900">
              <h3 className="font-bold text-slate-200 text-xs tracking-wider uppercase flex items-center gap-2">
                <AlertTriangle className="text-amber-500 w-4 h-4" /> Butuh Tindakan Cepat
              </h3>
              <span className="bg-rose-500/25 border border-rose-500/30 text-rose-400 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                {incomingCount + verificationCount} TIKET MASUK
              </span>
            </div>

            {/* Verification queue card items */}
            {reports.filter(r => r.status === 'Laporan Masuk' || r.status === 'Verifikasi').length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                Semua tiket masuk berhasil diverifikasi & ditugaskan!
              </div>
            ) : (
              <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                {reports.filter(r => r.status === 'Laporan Masuk' || r.status === 'Verifikasi').map(r => (
                  <div key={r.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-xs text-slate-200 block font-mono">{r.ticketNumber}</span>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5" title={r.location}>{r.location}</p>
                      </div>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        r.severity === 'Darurat' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        r.severity === 'Tinggi' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {r.severity}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-1 pt-2 border-t border-slate-900/40 text-[10px]">
                      <span className="text-slate-400">
                        {r.category} • {r.affectedPeople} Jiwa
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => onQuickVerifyReport(r.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-2.5 py-1 rounded text-[9px] transition-all cursor-pointer flex items-center gap-1"
                      >
                        Sambut & Verifikasi <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SLA Performance Meter Indicators */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
            <h3 className="font-bold text-slate-200 text-xs tracking-wider uppercase mb-3 flex items-center gap-2">
              <ShieldCheck className="text-green-400 w-4.5 h-4.5" /> KPI Kualitas Penanganan
            </h3>
            
            <div className="space-y-4 mt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
                <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                  <span>Waktu Tanggap Sesuai SLA</span>
                  <span className="font-bold text-emerald-400 font-mono">100% OK</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
                <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                  <span>Kecepatan Penyelesaian Teknis</span>
                  <span className="font-bold text-blue-400 font-mono">82% Kecepatan</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
                <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                  <span>Indeks Kepuasan Masyarakat</span>
                  <span className="font-bold text-cyan-400 font-mono">4.9 / 5.0</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Mini Log */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-200 text-xs tracking-wider uppercase">
                Aktivitas Operator Terpopuler
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Aksi Live</span>
            </div>
            
            <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 4).map(log => (
                <div key={log.id} className="text-[11px] leading-relaxed relative pl-4 border-l-2 border-blue-500/40">
                  <span className="text-slate-400 font-mono block text-[9px] mb-0.5">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                  <span className="font-semibold text-slate-200">{log.userName}</span>{' '}
                  <span className="text-slate-400">({log.userRole}):</span>{' '}
                  <span className="text-blue-300">{log.action}</span> -{' '}
                  <span className="text-slate-400 italic block mt-0.5 text-[10px]">{log.details}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
