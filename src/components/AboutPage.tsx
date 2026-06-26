/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, Clock, CheckCircle, Droplet, Shield, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div id="about-page-container" className="p-6 space-y-6 font-sans bg-slate-900 min-h-screen text-slate-100 pb-16">
      
      {/* Header section */}
      <header className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Panduan Standar Operasional & SLA Krisis Air
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Informasi panduan, matriks eskalasi, indeks krisis, dan panduan mitigasi kekeringan wilayah Provinsi Jawa Barat.
        </p>
      </header>

      {/* SLA Matrices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* left card: SLA Matrix levels */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-900 pb-3">
            <Clock className="text-blue-400 w-4.5 h-4.5" /> Matriks Waktu Tanggap & Eskalasi Mobil Tangki
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl relative overflow-hidden">
              <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-extrabold uppercase font-mono">Tingkat 1: Darurat</span>
              <p className="text-xs text-slate-200 font-bold mt-2">Dukungan Air Bersih Tiba Sektor Utama dalam &lt; 2 Jam</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Diberlakukan jika pemukiman padat mengalami kekeringan total lebih dari 3 hari, atau instalasi PAM pecah total. Wajib pengerahan armada tangki 5000L.
              </p>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl relative overflow-hidden">
              <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-extrabold uppercase font-mono">Tingkat 2: Tinggi</span>
              <p className="text-xs text-slate-200 font-bold mt-2">Penanganan Masalah Lapangan di bawah &lt; 6 Jam</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Air pipa PAM mengalir kotor/berwarna kekuningan yang berdampak luas kesehatan. Penutupan katup pipa dan penyedotan endapan dikerjakan teknisi terampil.
              </p>
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl relative overflow-hidden">
              <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-extrabold uppercase font-mono">Tingkat 3: Sedang/Rendah</span>
              <p className="text-xs text-slate-200 font-bold mt-2">Penyadapan Meteran & Kebocoran Kecil &lt; 24 Jam</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Rembesan ringan meteran atau fluktuasi debit air rendah di jam sibuk. Pemantauan berkala dan perbaikan segel dilakukan tanpa mengganggu suplai tetangga.
              </p>
            </div>
          </div>
        </div>

        {/* Right card: Mitigation & FAQ */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-900 pb-3">
            <BookOpen className="text-cyan-400 w-4.5 h-4.5" /> Panduan Pelayanan Umum & Mitigasi Krisis Air
          </h2>

          <div className="space-y-4 text-xs leading-relaxed">
            
            <div className="space-y-1 bg-slate-900/45 p-3.5 rounded-xl border border-slate-850">
              <span className="font-bold text-slate-205 block">Bagaimana Cara Kerja Pemantauan Respons?</span>
              <p className="text-[11px] text-slate-400">
                Sistem menghitung rasio waktu mulai dari laporan diunggah masyarakat ("Laporan Masuk"), dikonfirmasi kelayakannya oleh admin ("Verifikasi"), dipasangkan ke tim teknisi lapangan ("Ditugaskan"), hingga air normal ("Selesai").
              </p>
            </div>

            <div className="space-y-1 bg-slate-900/45 p-3.5 rounded-xl border border-slate-850">
              <span className="font-bold text-slate-205 block">Bagaimana Cara Mengajukan Bantuan Tangki Air Darurat?</span>
              <p className="text-[11px] text-slate-400">
                Warga dapat masuk ke akun portal warga mereka, klik tombol "Laporkan Gangguan Air", masukkan data detail lokasi dan estimasi jumlah kepala keluarga terdampak. Tim akan memprioritaskan wilayah berkategori "Darurat".
              </p>
            </div>

            <div className="p-3.5 bg-blue-950/25 border border-blue-900/30 rounded-xl space-y-2">
              <h2 className="font-semibold text-[10.5px] uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Jaminan Hak Akses Transparan
              </h2>
              <p className="text-[11px] text-slate-400 leading-normal">
                Modul ini dikelola secara sinergis oleh Dinas Sumber Daya Air Jawa Barat & PDAM setempat guna menjamin akuntabilitas waktu kerja petugas tanggap krisis secara transparan bagi publik.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
