/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Play, 
  Plus, 
  ClipboardCopy, 
  X,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { WaterReport, SeverityLevel, ReportStatus, AppUser } from '../types';
import { WEST_JAVA_SUBDISTRICTS } from '../mockData';

interface PetugasDashboardProps {
  currentUser: AppUser;
  reports: WaterReport[];
  onSubmitNewReport: (reportData: Omit<WaterReport, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, nextStatus: ReportStatus, resolutionNotes?: string) => void;
  onDeleteReport?: (id: string) => void;
}

export default function PetugasDashboard({
  currentUser,
  reports,
  onSubmitNewReport,
  onUpdateStatus,
  onDeleteReport
}: PetugasDashboardProps) {
  
  // States of filter and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  
  // New Report Modal Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newSubdistrict, setNewSubdistrict] = useState(WEST_JAVA_SUBDISTRICTS[0]);
  const [newSeverity, setNewSeverity] = useState<SeverityLevel>('Sedang');
  const [newCategory, setNewCategory] = useState<WaterReport['category']>('Kebocoran Pipa');
  const [newAffectedPeople, setNewAffectedPeople] = useState<number>(50);
  const [newReporterName, setNewReporterName] = useState('');
  const [newReporterPhone, setNewReporterPhone] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Status update modal notes
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [activeResolveTicketId, setActiveResolveTicketId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Filter reports assigned to this officer OR in their district area by default
  const officerSubdistrict = currentUser.assignedArea 
    ? currentUser.assignedArea.replace('Kec. ', '').split(',')[0].trim() 
    : '';

  const officerReports = reports.filter(r => {
    // If Admin, see all. If Petugas, show reports assigned to them OR in their jurisdiction (subdistrict name match)
    if (currentUser.role === 'Admin') return true;
    const isAssigned = r.assignedOfficer === currentUser.name;
    const isLocalJurisdiction = r.subdistrict.toLowerCase() === officerSubdistrict.toLowerCase();
    return isAssigned || isLocalJurisdiction;
  });

  // Apply search term and sidebar filters
  const filteredReports = officerReports.filter(r => {
    const matchesSearch = 
      r.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = selectedSeverity === 'Semua' || r.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'Semua' || r.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Calculate stats for this specific officer
  const myAssignedCount = officerReports.filter(r => r.assignedOfficer === currentUser.name).length;
  const mySolvedCount = officerReports.filter(r => r.assignedOfficer === currentUser.name && r.status === 'Selesai').length;
  const myActiveCount = myAssignedCount - mySolvedCount;

  // Handle Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation || !newReporterName || !newReporterPhone || !newDescription) {
      alert('Silakan lengkapi semua kolom wajib.');
      return;
    }

    onSubmitNewReport({
      location: newLocation,
      subdistrict: newSubdistrict,
      severity: newSeverity,
      affectedPeople: Number(newAffectedPeople),
      category: newCategory,
      description: newDescription,
      status: 'Laporan Masuk', // default starting status
      reporterName: newReporterName,
      reporterPhone: newReporterPhone,
      assignedOfficer: currentUser.name // Auto assign to submitting officer
    });

    // Reset Form fields
    setNewLocation('');
    setNewReporterName('');
    setNewReporterPhone('');
    setNewDescription('');
    setNewAffectedPeople(100);
    setIsFormOpen(false);
  };

  // Open resolution notes modal
  const handleOpenResolveModal = (id: string) => {
    setActiveResolveTicketId(id);
    setIsResolveModalOpen(true);
    setResolutionNotes('');
  };

  // Confirm resolving ticket
  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResolveTicketId) return;

    onUpdateStatus(activeResolveTicketId, 'Selesai', resolutionNotes);
    setIsResolveModalOpen(false);
    setActiveResolveTicketId(null);
  };

  // Fast transition status based on current status
  const transitionStatus = (r: WaterReport) => {
    if (r.status === 'Laporan Masuk') {
      onUpdateStatus(r.id, 'Verifikasi');
    } else if (r.status === 'Verifikasi') {
      onUpdateStatus(r.id, 'Ditugaskan');
    } else if (r.status === 'Ditugaskan') {
      onUpdateStatus(r.id, 'Sedang Ditangani');
    } else if (r.status === 'Sedang Ditangani') {
      handleOpenResolveModal(r.id);
    }
  };

  return (
    <div id="petugas-dashboard-container" className="p-6 space-y-6 font-sans bg-slate-900 min-h-screen text-slate-100 pb-16">
      
      {/* 1. Header with fast creation actions */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 p-5 rounded-2xl border border-cyan-900/10 backdrop-blur-md">
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest block w-fit mb-1.5">
            DOCK PETUGAS LAPANGAN
          </span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Manajemen Operasional & Waktu Tanggap
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Wilayah Yurisdiksi Kerja Anda: <strong className="text-cyan-400 font-medium">{currentUser.assignedArea || 'Seluruh Wilayah'}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Laporkan Krisis Baru
        </button>
      </header>

      {/* 3. Filter and Reports Table Board */}
      <section className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6">
        
        {/* Filters bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-slate-900">
          <h2 className="text-sm font-bold text-slate-200">Daftar Antrean & Laporan krisis Air ({filteredReports.length})</h2>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs min-w-[180px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kata kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-semibold text-slate-500">Keparahan:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none"
              >
                <option value="Semua">Semua</option>
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Darurat">Darurat</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-semibold text-slate-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none font-medium"
              >
                <option value="Semua">Semua</option>
                <option value="Laporan Masuk">Laporan Masuk</option>
                <option value="Verifikasi">Verifikasi</option>
                <option value="Ditugaskan">Ditugaskan</option>
                <option value="Sedang Ditangani">Sedang Ditangani</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid container */}
        {filteredReports.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <ClipboardCopy className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-xs">Tidak ditemukan data laporan aktif yang memenuhi penyaringan di wilayah Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((r) => {
              
              // Color map for severity levels
              const severityColors = {
                Rendah: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                Sedang: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                Tinggi: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
                Darurat: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse',
              };

              // Color map for current status
              const statusColors = {
                'Laporan Masuk': 'bg-slate-800 text-slate-300',
                'Verifikasi': 'bg-purple-500/15 text-purple-400',
                'Ditugaskan': 'bg-blue-500/15 text-blue-400',
                'Sedang Ditangani': 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
                'Selesai': 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
              };

              // Label translation/helpers for quick actions button
              const nextActionLabels = {
                'Laporan Masuk': 'Memulai Verifikasi',
                'Verifikasi': 'Siap Ditugaskan',
                'Ditugaskan': 'Mulai Tangani Lapangan',
                'Sedang Ditangani': 'Selesaikan Penanganan',
                'Selesai': 'Telah Selesai Berhasil',
              };

              return (
                <div 
                  key={r.id} 
                  className={`p-5 rounded-2xl bg-slate-900/60 border hover:bg-slate-900 transition-colors flex flex-col justify-between ${
                    r.status === 'Selesai' ? 'border-slate-800/40 opacity-85' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Ticket Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                            {r.ticketNumber}
                          </span>
                          <span className="text-slate-500 text-[10px]">•</span>
                          <span className="text-[10px] text-slate-400 font-medium">{r.category}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono inline-block mt-1">
                          Dilaporkan: {new Date(r.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${severityColors[r.severity]}`}>
                          {r.severity}
                        </span>
                        <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>

                    {/* Crisis details & location */}
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-200 font-medium line-clamp-2 leading-relaxed" title={r.description}>
                        {r.description}
                      </p>
                      
                      <div className="flex items-start gap-1 text-slate-400 text-[11px] mt-1">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" />
                        <span className="line-clamp-2">{r.location}, Kec. {r.subdistrict}</span>
                      </div>
                    </div>

                    {/* Stats metrics of impacts */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-900/60 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase leading-none mb-0.5">TERDAMPAK</span>
                          <span className="font-bold font-mono text-slate-300">{r.affectedPeople} Jiwa / KK</span>
                        </div>
                      </div>
                      
                      {r.responseTimeMinutes !== undefined ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <div>
                            <span className="text-[9px] text-slate-500 block uppercase leading-none mb-0.5">WAKTU TANGGAP</span>
                            <span className="font-bold font-mono text-emerald-400">{r.responseTimeMinutes} Menit</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-600 animate-pulse" />
                          <div>
                            <span className="text-[9px] text-slate-500 block uppercase leading-none mb-0.5">WAKTU TANGGAP</span>
                            <span className="font-semibold text-slate-500">Sedang Dihitung</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Officer assignment badge */}
                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-900/40 text-slate-400">
                      <span>Pelapor: <strong>{r.reporterName}</strong> ({r.reporterPhone})</span>
                      {r.assignedOfficer && (
                        <span className="bg-blue-500/5 text-blue-300 border border-blue-500/10 px-2 py-0.5 rounded text-[10px]">
                          Petugas: {r.assignedOfficer}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resolution Note if ticket is finished successfully */}
                  {r.status === 'Selesai' && r.resolutionNotes && (
                    <div className="mt-3.5 p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-[11px]">
                      <span className="font-bold text-emerald-400 block mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Laporan Selesai Ditangani
                      </span>
                      <p className="text-slate-400 leading-normal italic">
                        "{r.resolutionNotes}"
                      </p>
                    </div>
                  )}

                  {/* Operational Action buttons bar */}
                  {(r.status !== 'Selesai' || onDeleteReport) && (
                    <div className="mt-4 pt-4 border-t border-slate-900 flex gap-2">
                      {r.status !== 'Selesai' && (
                        <button
                          type="button"
                          onClick={() => transitionStatus(r)}
                          className={`flex-1 font-bold py-2 px-3 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 text-white ${
                            r.status === 'Laporan Masuk' ? 'bg-slate-700 hover:bg-slate-600' :
                            r.status === 'Verifikasi' ? 'bg-purple-600 hover:bg-purple-500' :
                            r.status === 'Ditugaskan' ? 'bg-amber-600 hover:bg-amber-500' :
                            'bg-emerald-600 hover:bg-emerald-500'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{nextActionLabels[r.status]}</span>
                        </button>
                      )}

                      {onDeleteReport && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus data tiket ${r.ticketNumber}?`)) {
                              onDeleteReport(r.id);
                            }
                          }}
                          className={`bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 p-2 rounded-lg border border-slate-800 hover:border-rose-900 text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            r.status === 'Selesai' ? 'w-full py-2 bg-rose-950/20 hover:bg-rose-950 border border-slate-800 hover:border-rose-900 text-rose-400 font-semibold rounded-lg' : ''
                          }`}
                          title="Hapus Tiket"
                        >
                          <Trash2 className="w-4 h-4" />
                          {r.status === 'Selesai' && <span>Hapus Laporan Selesai</span>}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. MODAL 1: Form Input Laporan Baru (Petugas can write) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="text-cyan-400 w-5 h-5" /> Form Input Laporan Krisis Air
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Gunakan form ini untuk merekrut krisis baru langsung dari laporan warga di lapangan.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
              
              <div className="grid grid-cols-2 gap-3">
                {/* Kecamatan Select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 block uppercase">Kecamatan (Wilayah)</label>
                  <select
                    value={newSubdistrict}
                    onChange={(e) => setNewSubdistrict(e.target.value)}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    {WEST_JAVA_SUBDISTRICTS.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Crisis Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 block uppercase">Kategori Masalah</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Kebocoran Pipa">Kebocoran Pipa</option>
                    <option value="Kekeringan">Kekeringan</option>
                    <option value="Air Keruh/Tercemar">Air Keruh / Tercemar</option>
                    <option value="Distribusi Terhenti">Distribusi Terhenti PAM</option>
                    <option value="Krisis Debit Air">Krisis Debit Air</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Severity */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 block uppercase">Tingkat Keparahan</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as SeverityLevel)}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Rendah">Rendah (Kebocoran kecil)</option>
                    <option value="Sedang">Sedang (Berdampak sedang)</option>
                    <option value="Tinggi">Tinggi (Suplai sangat kuning/bau)</option>
                    <option value="Darurat">Darurat (Mengering total lebih dari 3 hari)</option>
                  </select>
                </div>

                {/* Affected People qty */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 block uppercase">Masyarakat Terdampak (Estimasi Jiwa)</label>
                  <input
                    type="number"
                    min="1"
                    value={newAffectedPeople}
                    onChange={(e) => setNewAffectedPeople(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Exact Location */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block uppercase">Lokasi Detail & Alamat</label>
                <input
                  type="text"
                  placeholder="Contoh: RT 03 RW 12, Gg. Gurita Samping Masjid..."
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Description explanation */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block uppercase">Deskripsi Masalah Lengkap</label>
                <textarea
                  rows={3}
                  placeholder="Detail masalah lapangan yang dilaporkan oleh masyarakat agar memudahkan petugas teknis..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Reporter name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 block uppercase">Nama Pelapor / Kontak Utama</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pak Suparjo"
                    value={newReporterName}
                    onChange={(e) => setNewReporterName(e.target.value)}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                {/* Reporter phone */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 block uppercase">No. Handphone (WhatsApp)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812xxxxxxxx"
                    value={newReporterPhone}
                    onChange={(e) => setNewReporterPhone(e.target.value)}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg hover:shadow-blue-500/10 transition-colors cursor-pointer"
                >
                  Simpan & Daftarkan Laporan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL 2: Close / Selesaikan Laporan dengan input Catatan Penyelesaian */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="text-green-400 w-5 h-5 animate-pulse" /> Selesaikan Laporan Krisis Air
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Tuliskan bukti solusi atau catatan penanganan krisis air di lapangan untuk ditutup secara permanen.
              </p>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block uppercase">Catatan Resolusi Tambahan</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Truk tangki 5000L dikirim sukses terpasang. Seal pipa diganti..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-green-500"
                  required
                ></textarea>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg transition-colors cursor-pointer"
                >
                  Tandai Selesai (Simpan)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
