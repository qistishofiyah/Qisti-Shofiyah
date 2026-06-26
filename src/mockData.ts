/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WaterReport, AppUser, ActivityLog, PushNotification } from './types';

export const WEST_JAVA_SUBDISTRICTS = [
  'Coblong (Kota Bandung)',
  'Lembang (Bandung Barat)',
  'Jatinangor (Sumedang)',
  'Tarogong Kidul (Garut)',
  'Ciawi (Bogor)',
  'Cikarang Barat (Bekasi)',
  'Cibadak (Sukabumi)',
  'Pelabuhan Ratu (Sukabumi)',
  'Cisarua (Bogor)',
  'Sukasari (Kota Bandung)',
  'Sumur Bandung (Kota Bandung)',
  'Plumbon (Cirebon)',
  'Cipanas (Cianjur)',
  'Soreang (Kab. Bandung)',
  'Margahayu (Kab. Bandung)',
  'Pacet (Cianjur)'
];

export const initialUsers: AppUser[] = [
  {
    id: 'u-1',
    name: 'Budi Hartono',
    email: 'admin@airkrisis.go.id',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedArea: 'Pusat Pengendali Jawa Barat',
    status: 'Aktif'
  },
  {
    id: 'u-2',
    name: 'Pratama Wijaya',
    email: 'petugas.pratama@airkrisis.go.id',
    role: 'Petugas',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedArea: 'Kec. Coblong, Kota Bandung',
    status: 'Aktif'
  },
  {
    id: 'u-3',
    name: 'Siti Rahma',
    email: 'petugas.siti@airkrisis.go.id',
    role: 'Petugas',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedArea: 'Kec. Lembang (Bandung Barat)',
    status: 'Aktif'
  },
  {
    id: 'u-4',
    name: 'Rian Anggara',
    email: 'rian@gmail.com',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedArea: 'Kel. Cigadung, Kec. Coblong',
    status: 'Aktif'
  },
  {
    id: 'u-5',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@gmail.com',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedArea: 'Kel. Ciseureuh, Purwakarta',
    status: 'Aktif'
  },
  {
    id: 'u-6',
    name: 'Ahmad Fauzi',
    email: 'fauzi.petugas@airkrisis.go.id',
    role: 'Petugas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedArea: 'Kec. Jatinangor (Sumedang)',
    status: 'Aktif'
  }
];

export const initialReports: WaterReport[] = [
  {
    id: 'rep-1',
    ticketNumber: 'TKT-2026-001',
    location: 'Dago Elos, RT 02 / RW 03, Bandung',
    subdistrict: 'Coblong (Kota Bandung)',
    severity: 'Darurat',
    affectedPeople: 450,
    category: 'Kekeringan',
    description: 'Sumber air tanah mengering total sejak 5 hari yang lalu karena efek el nino lokal. Warga terpaksa membeli air galon eceran untuk mandi dan kebutuhan dasar.',
    status: 'Selesai',
    reporterName: 'Mulyono',
    reporterPhone: '081234567890',
    createdAt: '2026-06-19T08:30:00Z',
    verifiedAt: '2026-06-19T08:45:00Z',
    assignedAt: '2026-06-19T09:00:00Z',
    processingAt: '2026-06-19T09:30:00Z',
    resolvedAt: '2026-06-19T11:45:00Z',
    assignedOfficer: 'Pratama Wijaya',
    resolutionNotes: 'Telah dikirimkan 3 truk tangki air bersih penampungan darurat berkapasitas total 15.000 liter. Bak penampungan umum berhasil diisi penuh.',
    responseTimeMinutes: 15,
    handlingTimeMinutes: 135,
    totalResponseTimeMinutes: 195
  },
  {
    id: 'rep-2',
    ticketNumber: 'TKT-2026-002',
    location: 'Kp. Kramat, RT 04 / RW 01, Lembang',
    subdistrict: 'Lembang (Bandung Barat)',
    severity: 'Tinggi',
    affectedPeople: 250,
    category: 'Air Keruh/Tercemar',
    description: 'Air pipa keluar berwarna coklat kehitaman dan berbau menyengat. Menimbulkan keresahan gatal-gatal pada anak-anak panti asuhan setempat.',
    status: 'Sedang Ditangani',
    reporterName: 'Siti Rahma',
    reporterPhone: '081987654321',
    createdAt: '2026-06-19T14:10:00Z',
    verifiedAt: '2026-06-19T14:28:00Z',
    assignedAt: '2026-06-19T15:00:00Z',
    processingAt: '2026-06-20T02:00:00Z',
    assignedOfficer: 'Siti Rahma',
    responseTimeMinutes: 18,
    handlingTimeMinutes: undefined,
    totalResponseTimeMinutes: undefined
  },
  {
    id: 'rep-3',
    ticketNumber: 'TKT-2026-003',
    location: 'Jl. Ir. H. Juanda Gg. Gurame No. 15',
    subdistrict: 'Coblong (Kota Bandung)',
    severity: 'Sedang',
    affectedPeople: 120,
    category: 'Kebocoran Pipa',
    description: 'Ada pipa distribusi utama PDAM yang retak dan semburan air setinggi 1 meter menggenangi gang warga.',
    status: 'Ditugaskan',
    reporterName: 'Supriadi',
    reporterPhone: '087766554433',
    createdAt: '2026-06-20T01:15:00Z',
    verifiedAt: '2026-06-20T01:45:00Z',
    assignedAt: '2026-06-20T03:30:00Z',
    assignedOfficer: 'Pratama Wijaya',
    responseTimeMinutes: 30,
  },
  {
    id: 'rep-4',
    ticketNumber: 'TKT-2026-004',
    location: 'Perumahan Kopri Gg. Flamboyan, RT 02 / RW 12',
    subdistrict: 'Jatinangor (Sumedang)',
    severity: 'Sedang',
    affectedPeople: 80,
    category: 'Distribusi Terhenti',
    description: 'Aliran air dari saluran pipa terhenti total tanpa pemberitahuan sebelumnya sejak jam 6 pagi.',
    status: 'Verifikasi',
    reporterName: 'Dewi Lestari',
    reporterPhone: '085211223344',
    createdAt: '2026-06-20T04:20:00Z',
    verifiedAt: '2026-06-20T04:50:00Z',
    responseTimeMinutes: 30,
  },
  {
    id: 'rep-5',
    ticketNumber: 'TKT-2026-005',
    location: 'Kp. Pasir Angin, RT 05 / RW 03',
    subdistrict: 'Cisarua (Bogor)',
    severity: 'Darurat',
    affectedPeople: 550,
    category: 'Krisis Debit Air',
    description: 'Kemarau panjang ekstrim membuat seluruh sumur resapan warga mengering total. Mengakibatkan krisis air minum.',
    status: 'Laporan Masuk',
    reporterName: 'Sunarto',
    reporterPhone: '081399887766',
    createdAt: '2026-06-20T05:00:00Z'
  },
  {
    id: 'rep-6',
    ticketNumber: 'TKT-2026-006',
    location: 'Kawasan Mandiri Cikarang Mas, RT 11 / RW 07',
    subdistrict: 'Cikarang Barat (Bekasi)',
    severity: 'Rendah',
    affectedPeople: 35,
    category: 'Kebocoran Pipa',
    description: 'Kebocoran kecil pada pipa meteran air warga dan mengalir ke selokan utama. Sifatnya tidak terlalu mendesak.',
    status: 'Selesai',
    reporterName: 'Hendra Wijaya',
    reporterPhone: '081255443311',
    createdAt: '2026-06-18T10:00:00Z',
    verifiedAt: '2026-06-18T10:20:00Z',
    assignedAt: '2026-06-18T11:00:00Z',
    processingAt: '2026-06-18T11:30:00Z',
    resolvedAt: '2026-06-18T12:45:00Z',
    assignedOfficer: 'Ahmad Fauzi',
    resolutionNotes: 'Sudah diganti karet seal pada pipa bocor. Air mengalir normal tanpa rembes.',
    responseTimeMinutes: 20,
    handlingTimeMinutes: 75,
    totalResponseTimeMinutes: 165
  }
];

export const initialLogs: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-06-20T05:05:00Z',
    userId: 'u-4',
    userName: 'Rian Anggara',
    userRole: 'User',
    action: 'Kirim Laporan Baru',
    details: 'Membuat laporan krisis air TKT-2026-005 di Kp. Pasir Angin Cisarua'
  },
  {
    id: 'log-2',
    timestamp: '2026-06-20T04:50:00Z',
    userId: 'u-1',
    userName: 'Budi Hartono',
    userRole: 'Admin',
    action: 'Verifikasi Laporan',
    details: 'Memverifikasi kelayakan laporan TKT-2026-004 dan menambahkan saran prioritas'
  },
  {
    id: 'log-3',
    timestamp: '2026-06-20T03:30:00Z',
    userId: 'u-1',
    userName: 'Budi Hartono',
    userRole: 'Admin',
    action: 'Penugasan Petugas',
    details: 'Menugaskan petugas Pratama Wijaya untuk menangani kebocoran pipa TKT-2026-003'
  },
  {
    id: 'log-4',
    timestamp: '2026-06-20T02:00:00Z',
    userId: 'u-3',
    userName: 'Siti Rahma',
    userRole: 'Petugas',
    action: 'Mulai Penanganan',
    details: 'Petugas Siti Rahma mengubah status TKT-2026-002 menjadi Sedang Ditangani di lapangan'
  },
  {
    id: 'log-5',
    timestamp: '2026-06-19T11:45:00Z',
    userId: 'u-2',
    userName: 'Pratama Wijaya',
    userRole: 'Petugas',
    action: 'Selesaikan Laporan',
    details: 'Menandai laporan TKT-2026-001 selesai dengan catatan distribusi truk tangki berhasil'
  }
];

export const initialNotifications: PushNotification[] = [
  {
    id: 'notif-1',
    title: 'Laporan Baru Masuk',
    message: 'Krisis air parah dilaporkan di Cisarua dengan tingkat keparahan DARURAT!',
    timestamp: '2026-06-20T05:00:00Z',
    isRead: false,
    type: 'error',
    relatedTicketId: 'rep-5'
  },
  {
    id: 'notif-2',
    title: 'Status Diperbarui',
    message: 'Tiket TKT-2026-002 sekarang berstatus [Sedang Ditangani] oleh petugas Siti Rahma.',
    timestamp: '2026-06-20T02:00:00Z',
    isRead: false,
    type: 'success',
    relatedTicketId: 'rep-2'
  },
  {
    id: 'notif-3',
    title: 'Petugas Ditugaskan',
    message: 'Pratama Wijaya ditugaskan untuk menangani kebocoran pipa utama TKT-2026-003.',
    timestamp: '2026-06-20T03:30:00Z',
    isRead: true,
    type: 'info',
    relatedTicketId: 'rep-3'
  },
  {
    id: 'notif-4',
    title: 'Penanganan Berhasil Selesai',
    message: 'Tiket TKT-2026-001 oleh pelapor Mulyono telah ditutup dengan kesimpulan sukses mendistribusikan air.',
    timestamp: '2026-06-19T11:45:00Z',
    isRead: true,
    type: 'success',
    relatedTicketId: 'rep-1'
  }
];
