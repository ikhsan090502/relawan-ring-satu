
import { ReportStatus, Report, User, UserRole } from './types';

export const MOCK_DATABASE_USERS: User[] = [
  {
    id: 'ADM-01',
    name: 'Dispatcher Medis',
    email: 'dispatcher@ring-satu.id',
    phone: '0811-0000-1111',
    role: UserRole.ADMIN,
    avatar: '',
    status: 'Aktif'
  },
  {
    id: 'WRG-01',
    name: 'Budi Santoso',
    email: 'budi@warga.com',
    phone: '0812-3456-7890',
    role: UserRole.WARGA,
    avatar: '',
    status: 'Aktif'
  },
  {
    id: 'AMB-01',
    name: 'Tim Ambulance Alpha',
    email: 'alpha@ambulance.id',
    phone: '0812-5555-6666',
    role: UserRole.RELAWAN,
    avatar: '',
    status: 'Aktif',
    expertise: 'Advanced Life Support (ALS)'
  },
  {
    id: 'AMB-02',
    name: 'Tim Ambulance Beta',
    email: 'beta@ambulance.id',
    phone: '0812-5555-7777',
    role: UserRole.RELAWAN,
    avatar: '',
    status: 'Aktif',
    expertise: 'Basic Life Support (BLS)'
  },
  {
    id: 'PIM-01',
    name: 'Kepala Dinas Kesehatan',
    email: 'pimpinan@dinkes.go.id',
    phone: '0811-2222-3333',
    role: UserRole.PIMPINAN,
    avatar: '',
    status: 'Aktif'
  }
];

export const CURRENT_USER = MOCK_DATABASE_USERS[1]; 

export const MOCK_REPORTS: Report[] = [
  {
    id: 'MED-2024-001',
    reporterName: 'Budi Santoso',
    whatsapp: '0812-3456-7890',
    patientName: 'Ny. Siti Aminah',
    patientAge: '65',
    eventDate: '2024-03-20',
    eventTime: '14:30',
    category: 'Gawat Darurat',
    location: 'Jl. Melati No. 45 (Dekat Pos RW)',
    urgentNeeds: ['Oksigen', 'Tandu'],
    description: 'Pasien sesak napas berat dan tidak bisa berjalan.',
    chronology: 'Riwayat jantung, tiba-tiba mengeluh nyeri dada dan sesak.',
    status: ReportStatus.MENUNGGU,
    urgency: 'Merah (Kritis)',
    createdAt: new Date().toISOString()
  }
];
