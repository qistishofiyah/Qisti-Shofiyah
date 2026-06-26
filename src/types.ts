/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SeverityLevel = 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';

export type ReportStatus = 'Laporan Masuk' | 'Verifikasi' | 'Ditugaskan' | 'Sedang Ditangani' | 'Selesai';

export interface WaterReport {
  id: string;
  ticketNumber: string; // e.g. TKT-2026-001
  location: string;
  subdistrict: string; // Kecamatan
  severity: SeverityLevel;
  affectedPeople: number; // Jumlah terdampak (Jiwa/KK)
  category: 'Kekeringan' | 'Kebocoran Pipa' | 'Air Keruh/Tercemar' | 'Distribusi Terhenti' | 'Krisis Debit Air';
  description: string;
  status: ReportStatus;
  reporterName: string;
  reporterPhone: string;
  createdAt: string; // ISO String
  verifiedAt?: string;
  assignedAt?: string;
  processingAt?: string;
  resolvedAt?: string;
  assignedOfficer?: string; // Nama petugas
  resolutionNotes?: string;
  // Response times in minutes
  responseTimeMinutes?: number; // verifiedAt - createdAt
  handlingTimeMinutes?: number; // resolvedAt - processingAt
  totalResponseTimeMinutes?: number; // resolvedAt - createdAt
}

export type UserRole = 'Admin' | 'Petugas' | 'User';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  assignedArea?: string; // Wilayah Tugas (untuk petugas / admin)
  status: 'Aktif' | 'Nonaktif';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  relatedTicketId?: string;
}
