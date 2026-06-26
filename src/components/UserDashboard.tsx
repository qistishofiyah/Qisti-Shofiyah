/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock, 
  X, 
  FileText, 
  AlertCircle, 
  Compass, 
  Share2, 
  Loader2,
  Droplet,
  Trash2
} from 'lucide-react';
import { WaterReport, SeverityLevel, ReportStatus, AppUser } from '../types';
import { WEST_JAVA_SUBDISTRICTS } from '../mockData';

interface UserDashboardProps {
  currentUser: AppUser;
  reports: WaterReport[];
  onSubmitNewReport: (reportData: Omit<WaterReport, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  onDeleteReport?: (id: string) => void;
}

export default function UserDashboard({
  currentUser,
  reports,
  onSubmitNewReport,
  onDeleteReport
}: UserDashboardProps) {
  
  // Tab for report view vs new report
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<WaterReport | null>(null);

  // Form input states
  const [newLocation, setNewLocation] = useState('');
  const [newSubdistrict, setNewSubdistrict] = useState(WEST_JAVA_SUBDISTRICTS[0]);
  const [newSeverity, setNewSeverity] = useState<SeverityLevel>('Sedang');
  const [newCategory, setNewCategory] = useState<WaterReport['category']>('Kebocoran Pipa');
  const [newAffectedPeople, setNewAffectedPeople] = useState<number>(30);
  const [newDescription, setNewDescription] = useState('');

  // Find reports filed by this particular citizen, fallback to general ones if none
  const myReports = reports.filter(r => r.reporterName === currentUser.name || r.reporterPhone === '085211223344');

  // Handle reporting form submission
  const handleUserSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation || !newDescription) {
      alert('Silakan isi seluruh bidang wajib.');
      return;
    }

    onSubmitNewReport({
      location: newLocation,
      subdistrict: newSubdistrict,
      severity: newSeverity,
      affectedPeople: Number(newAffectedPeople),
      category: newCategory,
      description: newDescription,
      status: 'Laporan Masuk',
      reporterName: currentUser.name,
      reporterPhone: '085211223344' // preset mock number
    });

    // Reset Form
    setNewLocation('');
    setNewDescription('');
    setIsReportModalOpen(false);
  };

  // Status mapping to elegant Indonesian explanations
  const statusExplanations = {
    'Laporan Masuk': {
      label: 'Diterima Sistem',
      color: 'bg-slate-800 text-slate-300',
      desc: 'Laporan Anda sukses terdaftar di server database pusat.'
    },
    'Verifikasi': {
      label: 'Diverifikasi Operator',
      color: 'bg-purple-900/40 text-purple-300 border border-purple-500/20',
      desc: 'Manajer admin memverifikasi rincian krisis air untuk penugasan.'
    },
    'Ditugaskan': {
      label: 'Petugas Ditugaskan',
      color: 'bg-blue-900/40 text-blue-300 border border-blue-500/20',
      desc: 'Petugas teknis terdekat dikerahkan menanggulangi kerusakan.'
    },
    'Sedang Ditangani': {
      label: 'Sedang Penanganan',
      color: 'bg-amber-900/40 text-amber-300 border border-amber-500/20',
      desc: 'Tim penanggulangan tangki air/konstruktor memperbaiki jaringan.'
    },
    'Selesai': {
      label: 'Selesai Berhasil',
      color: 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/20',
      desc: 'Pasokan air normal kembali dan penanganan darurat sukses ditutup.'
    },
  };

  return (
    <div id="user-dashboard-container" className="p-6 space-y-6 font-sans bg-slate-900 min-h-screen text-slate-100 pb-16">
      
      {/* Welcome Citizen Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-blue-950 p-6 rounded-2xl border border-blue-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">PORTAL WARGA</span>
            <h1 className="text-lg font-bold text-slate-100">Halo, {currentUser.name}!</h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Selamat datang di layanan Respons Mandiri Krisis Air. Anda dapat mendaftarkan keluhan suplai air bersih, melacak real-time status penanganan, dan memantau estimasi tanggap darurat.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Laporkan Gangguan Air
          </button>
        </div>
      </div>

      {/* Main Grid: My active reports list & Quick guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Col Span 2) - Citizen reports listed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" /> Riwayat Keluhan Air Bersih Saya
            </h2>

            {myReports.length === 0 ? (
              <div className="py-12 border border-slate-900/60 rounded-xl text-center text-slate-500 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="text-xs">Anda belum mendaftarkan pengaduan krisis air.</p>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="text-xs text-blue-400 hover:underline cursor-pointer"
                >
                  Kirim Pengaduan Pertama Anda &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myReports.map((r) => (
                  <div 
                    key={r.id}
                    onClick={() => setSelectedTicket(r)}
                    className="p-4 bg-slate-900/40 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold font-mono text-slate-350">{r.ticketNumber}</span>
                        <span className="text-slate-500 text-xs">•</span>
                        <span className="text-[10px] font-semibold text-slate-450 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">{r.category}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium truncate max-w-md">{r.description}</p>
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" /> Kel. {r.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-400" /> Terdampak {r.affectedPeople} Jiwa
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-between sm:justify-center items-end gap-2 w-full sm:w-auto border-t sm:border-0 border-slate-900 pt-2 sm:pt-0">
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${statusExplanations[r.status].color}`}>
                        {statusExplanations[r.status].label}
                      </span>
                      <span className="text-[10px] text-blue-400 font-semibold hover:underline hidden sm:block">Lihat Timeline Progress &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Status track breakdown detailing response times */}
        <div id="timeline-breakdown-panel" className="space-y-6">
          
          {selectedTicket ? (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Pelacakan Detail Tiket</span>
                  <span className="text-sm font-bold text-slate-200">{selectedTicket.ticketNumber}</span>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="text-xs text-slate-500 hover:text-white bg-slate-900 border border-slate-800 p-1 rounded-lg"
                >
                  Tutup
                </button>
              </div>

              {/* Steps timeline vertical diagram */}
              <div className="space-y-4">
                
                {/* 1. Laporan Masuk */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-[10px] text-slate-950 font-bold flex items-center justify-center">1</div>
                    <div className="w-0.5 h-10 bg-blue-500"></div>
                  </div>
                  <div className="text-xs pb-2">
                    <span className="font-bold text-slate-200 block">Laporan Diterima Sistem</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(selectedTicket.createdAt).toLocaleTimeString('id-ID')} WIB</span>
                    <p className="text-slate-400 text-[10px] mt-0.5">Laporan berhasil diunggah dan terindeks status masuk.</p>
                  </div>
                </div>

                {/* 2. Verifikasi status */}
                {['Verifikasi', 'Ditugaskan', 'Sedang Ditangani', 'Selesai'].includes(selectedTicket.status) ? (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-[10px] text-slate-950 font-bold flex items-center justify-center">2</div>
                      <div className="w-0.5 h-10 bg-blue-500"></div>
                    </div>
                    <div className="text-xs pb-2">
                      <span className="font-bold text-slate-200 block">Diverifikasi Pihak PAM Jaya</span>
                      <span className="text-[10px] text-slate-500 font-mono">Respon tanggap: {selectedTicket.responseTimeMinutes || 15}m</span>
                      <p className="text-slate-400 text-[10px] mt-0.5">Petugas memvalidasi urgensi dan volume air warga.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 text-slate-600 opacity-60">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">2</div>
                      <div className="w-0.5 h-10 bg-slate-800"></div>
                    </div>
                    <div className="text-xs pb-2">
                      <span className="font-semibold block">Dalam Antrean Verifikasi</span>
                      <p className="text-[10.5px] mt-0.5">Kebutuhan sedang dianalisis berdasarkan bobot keparahan.</p>
                    </div>
                  </div>
                )}

                {/* 3. Penugasan */}
                {['Ditugaskan', 'Sedang Ditangani', 'Selesai'].includes(selectedTicket.status) ? (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-[10px] text-slate-950 font-bold flex items-center justify-center">3</div>
                      <div className="w-0.5 h-10 bg-blue-500"></div>
                    </div>
                    <div className="text-xs pb-2">
                      <span className="font-bold text-slate-200 block">Petugas Dikerahkan Lapangan</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Ditugaskan ke: <strong className="text-blue-300 font-medium">{selectedTicket.assignedOfficer || 'Tim Satgas'}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 text-slate-600 opacity-60">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">3</div>
                      <div className="w-0.5 h-10 bg-slate-800"></div>
                    </div>
                    <div className="text-xs pb-2">
                      <span className="font-semibold block">Penugasan Petugas Teknis</span>
                    </div>
                  </div>
                )}

                {/* 4. Sedang Ditangani */}
                {['Sedang Ditangani', 'Selesai'].includes(selectedTicket.status) ? (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-[10px] text-slate-950 font-bold flex items-center justify-center">4</div>
                      <div className="w-0.5 h-10 bg-blue-500"></div>
                    </div>
                    <div className="text-xs pb-2">
                      <span className="font-bold text-slate-200 block">Proses Konstruksi / Air Darurat</span>
                      <p className="text-slate-400 text-[10px] mt-0.5">Pipa sedang disambung atau truk tanker air dikoordinasikan menuju titik RT/RW.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 text-slate-600 opacity-60">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">4</div>
                      <div className="w-0.5 h-10 bg-slate-800"></div>
                    </div>
                    <div className="text-xs pb-2">
                      <span className="font-semibold block">Penanganan Fisik / Suplai Air</span>
                    </div>
                  </div>
                )}

                {/* 5. Selesai */}
                {selectedTicket.status === 'Selesai' ? (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-[10px] text-slate-950 font-bold flex items-center justify-center font-mono">✓</div>
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-emerald-400 block">Selesai Normal Sempurna</span>
                      {selectedTicket.resolutionNotes && (
                        <p className="p-2 bg-emerald-500/5 border border-emerald-500/15 text-slate-400 rounded-lg shrink-0 mt-1 italic">
                          "{selectedTicket.resolutionNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 text-slate-600 opacity-60">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-mono">✓</div>
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold block">Selesai Berhasil</span>
                    </div>
                  </div>
                )}

              </div>

              {selectedTicket.status === 'Laporan Masuk' && onDeleteReport && (
                <div className="pt-4 border-t border-slate-900/60">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Apakah Anda yakin ingin membatalkan dan menghapus laporan ${selectedTicket.ticketNumber} Anda?`)) {
                        onDeleteReport(selectedTicket.id);
                        setSelectedTicket(null);
                      }
                    }}
                    className="w-full bg-rose-950/20 hover:bg-rose-950 border border-slate-800 hover:border-rose-900 text-rose-400 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Batalkan & Hapus Laporan Saya</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-center text-slate-500 py-12 space-y-2">
              <Compass className="w-10 h-10 text-blue-500/30 mx-auto" />
              <h3 className="text-xs font-semibold text-slate-450 leading-relaxed">Pilih Salah Satu Laporan Saya</h3>
              <p className="text-[10.5px] text-slate-500 leading-normal">
                Klik pada riwayat keluhan air bersih di sebelah kiri untuk melacak proses, respon kerja petugas dan update log secara transparan.
              </p>
            </div>
          )}

          {/* SLA Standard Guidance Card for Citizen */}
          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 text-xs text-slate-350 space-y-3">
            <div className="flex items-center gap-1.5 text-blue-400 border-b border-slate-900 pb-2">
              <Droplet className="w-4 h-4 animate-bounce" />
              <span className="font-bold uppercase tracking-wider text-[10px]">Standar Layanan Respons PAM</span>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pemda berkomitmen memberikan penanganan krisis air tanggap darurat melalui pengangkutan truk tangki air bersih dalam kurun waktu berikut:
            </p>

            <ul className="space-y-1.5 font-mono text-[10px] text-slate-400 pl-1.5 list-disc list-inside">
              <li><strong className="text-rose-400 font-semibold">Tingkat Darurat:</strong> &lt; 2 Jam Tangki Tiba</li>
              <li><strong className="text-amber-400 font-semibold">Tingkat Tinggi:</strong> &lt; 4 Jam Evaluasi</li>
              <li><strong className="text-blue-400 font-semibold">Tingkat Sedang:</strong> &lt; 12 Jam Kontrol</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Citizen Report Dialog */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Droplet className="text-blue-400 w-5 h-5" /> Kirim Pengaduan Krisis Air Bersih
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Kirimkan rincian gangguan suplai air bersih Anda kepada operator dan petugas teknis respon cepat.
              </p>
            </div>

            <form onSubmit={handleUserSubmitReport} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Wilayah Kecamatan</label>
                  <select
                    value={newSubdistrict}
                    onChange={(e) => setNewSubdistrict(e.target.value)}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {WEST_JAVA_SUBDISTRICTS.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Jenis Hambatan</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Kekeringan">Kekeringan (Sumur Kering)</option>
                    <option value="Kebocoran Pipa">Kebocoran Jaringan PAM</option>
                    <option value="Air Keruh/Tercemar">Air Keruh, Berbau, Berwarna</option>
                    <option value="Distribusi Terhenti">Aliran Terhenti PAM</option>
                    <option value="Krisis Debit Air">Debit Air Sangat Kecil</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Tingkat Keparahan</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as SeverityLevel)}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Rendah">Rendah (Sedikit terganggu)</option>
                    <option value="Sedang">Sedang (Terasa mengganggu)</option>
                    <option value="Tinggi">Tinggi (Kuning parah & bau)</option>
                    <option value="Darurat">Darurat (Tidak ada air sama sekali)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Terdampak (Est KK/Jiwa)</label>
                  <input
                    type="number"
                    min="1"
                    value={newAffectedPeople}
                    onChange={(e) => setNewAffectedPeople(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Alamat Lengkap / Lokasi RT RW</label>
                <input
                  type="text"
                  placeholder="Contoh: Jl. Kakap RW 04, Gg. Kepiting II No. 12"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-505"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Deskripsi Kejadian Secara Detail</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Air PAM mati total sejak jam 5 pagi, tetangga satu RT juga mengalami hal serupa..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 rounded-lg p-2.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Ajukan Laporan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
