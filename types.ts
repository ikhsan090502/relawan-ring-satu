export enum UserRole {
  WARGA = "warga",
  ADMIN = "admin",
  RELAWAN = "ambulance",
  PIMPINAN = "pimpinan"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  expertise?: string;
  address?: string;
  status?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  urgency: string;
  location: string;
  locationLink?: string;
  urgentNeeds?: string[];
  chronology?: string;
  evidencePhoto?: string;
  reporterId: string;
  assignedVolunteerId?: string;
  createdAt?: string;
  updatedAt: string;
  patientName: string;
  patientAge: number;
  eventDate: string;
  reporterName: string;
  category?: string;
  eventTime?: string;
  whatsapp?: string;
  adminNotes?: string;
  volunteerReport?: {
    actionTaken: string;
    hospitalName: string;
    photo?: string;
  };
}

export enum ReportStatus {
  MENUNGGU = "Menunggu Triase",
  DISETUJUI = "Disetujui/Diteruskan",
  DITOLAK = "Ditolak/Non-Medis",
  KLARIFIKASI = "Butuh Info Pasien",
  MENUJU_LOKASI = "Ambulance Menuju Lokasi",
  TIBA_DI_LOKASI = "Penanganan Pasien",
  MENUJU_RS = "Menuju Rumah Sakit",
  SELESAI = "Selesai/Pasien Diserahterimakan"
}

export enum ReportPriority {
  RENDAH = "Rendah",
  SEDANG = "Sedang",
  TINGGI = "Tinggi",
  DARURAT = "Darurat"
}

export enum IncidentCategory {
  GAWAT_DARURAT = "Gawat Darurat",
  KECELAKAAN = "Kecelakaan",
  IBU_HAMIL = "Ibu Hamil/Melahirkan",
  LANSIA = "Lansia/Sakit Kronis",
  TRANSPORTASI_MEDIS = "Transportasi Medis",
  LAINNYA = "Lainnya"
}
