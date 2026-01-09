
export enum ReportStatus {
  MENUNGGU = 'Menunggu Triase',
  DISETUJUI = 'Disetujui/Diteruskan',
  DITOLAK = 'Ditolak/Non-Medis',
  KLARIFIKASI = 'Butuh Info Pasien',
  MENUJU_LOKASI = 'Ambulance Menuju Lokasi',
  TIBA_DI_LOKASI = 'Penanganan Pasien',
  MENUJU_RS = 'Menuju Rumah Sakit',
  SELESAI = 'Selesai/Pasien Diserahterimakan'
}

export enum UserRole {
  ADMIN = 'Admin/Dispatcher',
  RELAWAN = 'Tim Ambulance',
  WARGA = 'Warga/Pemohon',
  PIMPINAN = 'Pimpinan/Kepala RS'
}

export type IncidentCategory = 'Gawat Darurat' | 'Kecelakaan' | 'Ibu Hamil/Melahirkan' | 'Lansia/Sakit Kronis' | 'Transportasi Medis' | 'Lainnya';

export interface Report {
  id: string;
  reporterName: string;
  whatsapp: string;
  patientName: string;
  patientAge: string;
  eventDate: string;
  eventTime: string;
  category: IncidentCategory;
  location: string;
  locationLink?: string;
  coordinates?: { lat: number; lng: number };
  urgentNeeds: string[]; // Contoh: Oksigen, Kursi Roda, Tandu
  description: string; // Kondisi pasien saat ini
  chronology: string;
  evidencePhoto?: string;
  status: ReportStatus;
  urgency: 'Merah (Kritis)' | 'Kuning (Mendesak)' | 'Hijau (Stabil)';
  adminNotes?: string;
  assignedVolunteerId?: string; // ID Tim Ambulance yang bertugas
  targetHospital?: string;
  volunteerReport?: {
    actionTaken: string;
    hospitalName: string;
    photo: string;
  };
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  status: 'Aktif' | 'Nonaktif';
  expertise?: string; // Contoh: Perawat, Driver Medis, Dokter
  address?: string; // Optional address for Warga role
}
