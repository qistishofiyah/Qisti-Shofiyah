/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Radio, 
  MapPin, 
  Clock, 
  Search, 
  Users, 
  AlertTriangle, 
  FileCheck, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Droplet,
  Shuffle,
  Trash2
} from 'lucide-react';
import { WaterReport, SeverityLevel, ReportStatus, AppUser } from '../types';
import { WEST_JAVA_SUBDISTRICTS } from '../mockData';

interface MonitoringPageProps {
  reports: WaterReport[];
  currentUser: AppUser;
  onUpdateStatus: (id: string, nextStatus: ReportStatus) => void;
  onAssignOfficer: (id: string, officerName: string) => void;
  availableOfficers: AppUser[];
  onDeleteReport?: (id: string) => void;
}

export default function MonitoringPage({
  reports,
  currentUser,
  onUpdateStatus,
  onAssignOfficer,
  availableOfficers,
  onDeleteReport
}: MonitoringPageProps) {
  
  // States
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>('Semua');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Active highlighted report detail card on the side
  const [highlightedReportId, setHighlightedReportId] = useState<string | null>(
    reports.length > 0 ? reports[0].id : null
  );

  const highlightedReport = reports.find(r => r.id === highlightedReportId);

  // Filter calculations
  const filteredReports = reports.filter(r => {
    const matchesSub = selectedSubdistrict === 'Semua' || r.subdistrict === selectedSubdistrict;
    const matchesSev = selectedSeverity === 'Semua' || r.severity === selectedSeverity;
    const matchesStat = selectedStatus === 'Semua' || r.status === selectedStatus;
    const matchesSearch = 
      r.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSub && matchesSev && matchesStat && matchesSearch;
  });

  // KPI Calculations
  const reportsWithTotalTime = reports.filter(r => r.totalResponseTimeMinutes !== undefined);
  const avgSlaMinutes = reportsWithTotalTime.length > 0 
    ? Math.round(reportsWithTotalTime.reduce((sum, r) => sum + (r.totalResponseTimeMinutes || 0), 0) / reportsWithTotalTime.length) 
    : 160;

  // Level of water reserves simulator
  const reserves = [
    { name: 'Depot Bandung Utara (Coblong)', level: 82, cap: '120.000 L', status: 'Optimal' },
    { name: 'Depot Lembang', level: 44, cap: '90.000 L', status: 'Kurang (Isi Ulang)' },
    { name: 'Depot Jatinangor', level: 95, cap: '150.000 L', status: 'Penuh' }
  ];

  return (
    <div id="monitoring-page-container" className="p-6 space-y-6 font-sans bg-slate-900 min-h-screen text-slate-100 pb-16">
      
      {/* Page Header */}
      <header className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
            <h1 className="text-sm font-bold uppercase tracking-widest text-blue-400">PEMANTAUAN REAL-TIME</h1>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
            Papan Monitor Data & Analisis Waktu Tanggap (SLA)
          </h2>
          <p className="text-xs text-slate-400">
            Pusat monitoring transparansi waktu tanggap respons fisik krisis air Provinsi Jawa Barat.
          </p>
        </div>

        {/* Live counter */}
        <div className="flex gap-4">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center min-w-[100px]">
            <span className="text-[9px] text-slate-500 block uppercase font-bold text-center">Waktu Standard Tanggap SLA</span>
            <span className="font-mono text-base font-extrabold text-blue-400 block mt-1">30 MENIT</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center min-w-[100px]">
            <span className="text-[9px] text-slate-500 block uppercase font-bold text-center">Realisasi Rata-rata</span>
            <span className="font-mono text-base font-extrabold text-green-400 block mt-1">{avgSlaMinutes} MENIT</span>
          </div>
        </div>
      </header>

      {/* Reserves Reservoir and Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reserves.map((res) => (
          <div key={res.name} className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4.5 flex flex-col justify-between relative overflow-hidden group">
            {/* Reservoir interactive lookalike wave */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-blue-500/5 transition-all duration-1000 ease-in-out pointer-events-none"
              style={{ height: `${res.level}%` }}
            >
              <div className="w-full h-2 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 animate-pulse"></div>
            </div>

            <div className="z-10">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-stone-200">{res.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  res.level > 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  res.level > 50 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {res.status}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-mono text-white">{res.level}%</span>
                <span className="text-[10px] text-slate-400 font-semibold font-mono">Tersedia / Kapasitas {res.cap}</span>
              </div>
            </div>

            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mt-3.5 z-10">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${res.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </section>

      {/* Main interactive monitor board split screen layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Filter and Data list (Col Span 2) */}
        <div className="lg:col-span-2 bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-4">
          
          {/* Custom list filters block */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-900 pb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Radio className="w-4.5 h-4.5 text-blue-400 animate-pulse" /> Real-Time Feed Laporan Krisis Air
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search text filter */}
              <div className="relative min-w-[150px]">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari tiket/alamat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-500"
                />
              </div>

              {/* Kecamatan */}
              <select
                value={selectedSubdistrict}
                onChange={(e) => setSelectedSubdistrict(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-[11px] focus:outline-none focus:border-blue-500 text-slate-300 font-medium"
              >
                <option value="Semua">Kecamatan: Semua</option>
                {WEST_JAVA_SUBDISTRICTS.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>

              {/* Severity */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-[11px] focus:outline-none focus:border-blue-500 text-slate-300 font-medium"
              >
                <option value="Semua">Keparahan: Semua</option>
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Darurat">Darurat</option>
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-[11px] focus:outline-none focus:border-blue-500 text-slate-300 font-medium"
              >
                <option value="Semua">Status: Semua</option>
                <option value="Laporan Masuk">Laporan Masuk</option>
                <option value="Verifikasi">Verifikasi</option>
                <option value="Ditugaskan">Ditugaskan</option>
                <option value="Sedang Ditangani">Sedang Ditangani</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* List items representation */}
          {filteredReports.length === 0 ? (
            <div className="py-16 text-center text-slate-600 font-medium">
              Tidak ditemukan data krisis yang cocok dengan filter Anda.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredReports.map((r) => {
                const isActive = r.id === highlightedReportId;
                
                const severityColors = {
                  Rendah: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                  Sedang: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                  Tinggi: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
                  Darurat: 'bg-rose-500/15 text-rose-400 border border-rose-500/35',
                };

                const statusColors = {
                  'Laporan Masuk': 'bg-slate-800 text-slate-300',
                  'Verifikasi': 'bg-purple-500/15 text-purple-400',
                  'Ditugaskan': 'bg-blue-500/15 text-blue-400',
                  'Sedang Ditangani': 'bg-amber-500/15 text-amber-400',
                  'Selesai': 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
                };

                return (
                  <div
                    key={r.id}
                    onClick={() => setHighlightedReportId(r.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      isActive 
                        ? 'bg-blue-950/20 border-blue-500/80 shadow-lg shadow-blue-500/5' 
                        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-300">{r.ticketNumber}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] text-slate-400 lg:inline-block font-semibold">{r.category}</span>
                      </div>
                      <p className="text-[11.5px] text-slate-300 font-medium truncate max-w-sm" title={r.description}>{r.description}</p>
                      
                      <div className="flex items-center gap-2 text-[10.5px] text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" /> Kecamatan {r.subdistrict}
                        </span>
                        <span>•</span>
                        <span>Laporan: {new Date(r.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase leading-none ${severityColors[r.severity]}`}>
                          {r.severity}
                        </span>
                        <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full leading-none ${statusColors[r.status]}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Side: Highlight Detail and Response Time Logger Panel */}
        <div className="space-y-6">
          {highlightedReport ? (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              
              <div className="border-b border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Detail Laporan Terpilih</span>
                  <span className="text-sm font-bold text-slate-200">{highlightedReport.ticketNumber}</span>
                </div>
                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded uppercase ${
                  highlightedReport.severity === 'Darurat' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-300'
                }`}>
                  {highlightedReport.severity}
                </span>
              </div>

              {/* Location Detail */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Lokasi & Alamat</span>
                <p className="text-xs text-slate-300 leading-normal font-medium">{highlightedReport.location}</p>
                <p className="text-[10px] text-slate-500">Kecamatan {highlightedReport.subdistrict}, Jawa Barat</p>
              </div>

              {/* Description Detail */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Deskripsi Keluhan</span>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  "{highlightedReport.description}"
                </p>
              </div>

              {/* Status and Officer assignment */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Petugas Lapangan</span>
                  <p className="font-semibold text-slate-350 mt-1">{highlightedReport.assignedOfficer || 'Belum Ditugaskan'}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Masyarakat Terdampak</span>
                  <p className="font-semibold text-slate-350 mt-1">{highlightedReport.affectedPeople} Jiwa / KK</p>
                </div>
              </div>

              {/* WAKTU TANGGAP & RESPONSE TIMINGS ANALYSIS */}
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
                <h4 className="text-[10.5px] font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1 pb-1.5 border-b border-slate-950">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Analisis Kecepatan Respons (SLA)
                </h4>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Laporan Masuk:</span>
                    <span className="text-slate-200">
                      {new Date(highlightedReport.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>

                  {highlightedReport.verifiedAt && (
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Waktu Verifikasi:</span>
                      <span className="text-slate-200">
                        {new Date(highlightedReport.verifiedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-400">
                    <span>Status Waktu Tanggap:</span>
                    {highlightedReport.responseTimeMinutes !== undefined ? (
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 rounded border border-emerald-500/20 text-[10px]">
                        {highlightedReport.responseTimeMinutes} Menit (SLA Terpenuhi)
                      </span>
                    ) : (
                      <span className="text-amber-400 animate-pulse font-bold bg-amber-500/10 px-1.5 rounded border border-amber-500/20 text-[10px]">
                        Dalam Pemantauan
                      </span>
                    )}
                  </div>

                  {highlightedReport.resolvedAt && highlightedReport.totalResponseTimeMinutes && (
                    <div className="flex justify-between items-center text-slate-400 border-t border-slate-950 pt-1.5 mt-1">
                      <span>Total Selesai:</span>
                      <span className="text-cyan-400 font-bold">
                        {highlightedReport.totalResponseTimeMinutes} Menit
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Operations Action Drawer for Highlighting role features */}
              {currentUser.role === 'Admin' && highlightedReportId !== null && highlightedReport.status === 'Laporan Masuk' && (
                <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide block">Tindakan Admin Cepat</span>
                  <p className="text-slate-400 text-[10px]">Verifikasi kelayakan laporan ini sekarang agar tim petugas bisa dikirim.</p>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(highlightedReport.id, 'Verifikasi')}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-[10px] transition-colors cursor-pointer"
                    >
                      Konfirmasi Verifikasi Laporan
                    </button>
                  </div>
                </div>
              )}

              {/* Assignment action drawer */}
              {currentUser.role === 'Admin' && highlightedReport.status === 'Verifikasi' && (
                <div className="p-3 bg-cyan-950/20 border border-cyan-950/30 rounded-xl space-y-2 text-xs">
                  <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide block">Tunjuk Petugas Lapangan</label>
                  
                  <div className="flex gap-1.5">
                    <select
                      id="officer-select-command"
                      onChange={(e) => {
                        if (e.target.value) {
                          onAssignOfficer(highlightedReport.id, e.target.value);
                          onUpdateStatus(highlightedReport.id, 'Ditugaskan');
                        }
                      }}
                      className="w-full bg-slate-950 rounded p-2 text-[10.5px] text-slate-200 border border-slate-800"
                    >
                      <option value="">Pilih Petugas yang Siap...</option>
                      {availableOfficers.map(o => (
                        <option key={o.id} value={o.name}>{o.name} ({o.assignedArea?.split(',')[0]})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Administrative Delete Control for Admins / Officers */}
              {onDeleteReport && (currentUser.role === 'Admin' || currentUser.role === 'Petugas') && (
                <div className="p-3 bg-rose-950/15 border border-rose-900/40 rounded-xl space-y-2 text-xs mt-3">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide block">Kontrol Administratif</span>
                  <p className="text-slate-400 text-[10px]">Hapus secara permanen dari sistem pemantauan real-time.</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin menghapus laporan ${highlightedReport.ticketNumber} secara permanen?`)) {
                        onDeleteReport(highlightedReport.id);
                        setHighlightedReportId(null);
                      }
                    }}
                    className="w-full bg-rose-950/40 hover:bg-rose-900 border border-rose-900/60 text-rose-200 hover:text-white font-bold py-2 rounded text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Laporan dari Sistem</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-center text-slate-500 py-16">
              Pilih salah satu baris laporan di sebelah kiri untuk melihat rincian krisis air, progress penanganan, dan detail kordinat.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
