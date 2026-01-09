-- Setup script for Relawan Ring Satu MySQL Database
-- Run this script in MySQL command line or phpMyAdmin

-- Create database
CREATE DATABASE IF NOT EXISTS relawan_ring_satu;
USE relawan_ring_satu;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role ENUM('Admin/Dispatcher', 'Tim Ambulance', 'Warga/Pemohon', 'Pimpinan/Kepala RS') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
    avatar VARCHAR(500),
    expertise VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(20) PRIMARY KEY,
    reporter_name VARCHAR(255),
    whatsapp VARCHAR(20),
    patient_name VARCHAR(255),
    patient_age VARCHAR(10),
    event_date DATE,
    event_time TIME,
    category ENUM('Gawat Darurat', 'Kecelakaan', 'Ibu Hamil/Melahirkan', 'Lansia/Sakit Kronis', 'Transportasi Medis', 'Lainnya'),
    location TEXT,
    location_link VARCHAR(500),
    coordinates_lat DECIMAL(10,8),
    coordinates_lng DECIMAL(11,8),
    urgent_needs JSON,
    description TEXT,
    chronology TEXT,
    evidence_photo VARCHAR(500),
    status ENUM('Menunggu Triase', 'Disetujui/Diteruskan', 'Ditolak/Non-Medis', 'Butuh Info Pasien', 'Ambulance Menuju Lokasi', 'Penanganan Pasien', 'Menuju Rumah Sakit', 'Selesai/Pasien Diserahterimakan'),
    urgency ENUM('Merah (Kritis)', 'Kuning (Mendesak)', 'Hijau (Stabil)'),
    admin_notes TEXT,
    assigned_volunteer_id INT,
    target_hospital VARCHAR(255),
    volunteer_report JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_volunteer_id) REFERENCES users(id)
);

-- Insert default admin users
-- Password hash for 'password123' using bcrypt
INSERT INTO users (name, email, phone, role, password_hash, avatar, expertise) VALUES
('Dispatcher Medis', 'dispatcher@ring-satu.id', '0811-0000-1111', 'Admin/Dispatcher', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '', NULL),
('Tim Ambulance Alpha', 'alpha@ambulance.id', '0812-5555-6666', 'Tim Ambulance', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '', 'Advanced Life Support (ALS)'),
('Tim Ambulance Beta', 'beta@ambulance.id', '0812-5555-7777', 'Tim Ambulance', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '', 'Basic Life Support (BLS)'),
('Kepala Dinas Kesehatan', 'pimpinan@dinkes.go.id', '0811-2222-3333', 'Pimpinan/Kepala RS', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '', NULL);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_assigned_volunteer ON reports(assigned_volunteer_id);

-- Show success message
SELECT 'Database setup completed successfully!' as status;