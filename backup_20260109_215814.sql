-- MySQL dump 10.13  Distrib 8.0.44, for macos26.0 (arm64)
--
-- Host: localhost    Database: relawan_ring_satu
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` varchar(20) NOT NULL,
  `reporter_name` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `patient_name` varchar(255) DEFAULT NULL,
  `patient_age` varchar(10) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_time` time DEFAULT NULL,
  `category` enum('Gawat Darurat','Kecelakaan','Ibu Hamil/Melahirkan','Lansia/Sakit Kronis','Transportasi Medis','Lainnya') DEFAULT NULL,
  `location` text,
  `location_link` varchar(500) DEFAULT NULL,
  `coordinates_lat` decimal(10,8) DEFAULT NULL,
  `coordinates_lng` decimal(11,8) DEFAULT NULL,
  `urgent_needs` json DEFAULT NULL,
  `description` text,
  `chronology` text,
  `evidence_photo` varchar(500) DEFAULT NULL,
  `status` enum('Menunggu Triase','Disetujui/Diteruskan','Ditolak/Non-Medis','Butuh Info Pasien','Ambulance Menuju Lokasi','Penanganan Pasien','Menuju Rumah Sakit','Selesai/Pasien Diserahterimakan') DEFAULT NULL,
  `urgency` enum('Merah (Kritis)','Kuning (Mendesak)','Hijau (Stabil)') DEFAULT NULL,
  `admin_notes` text,
  `assigned_volunteer_id` int DEFAULT NULL,
  `target_hospital` varchar(255) DEFAULT NULL,
  `volunteer_report` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reports_status` (`status`),
  KEY `idx_reports_assigned_volunteer` (`assigned_volunteer_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`assigned_volunteer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('Admin/Dispatcher','Tim Ambulance','Warga/Pemohon','Pimpinan/Kepala RS') NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('Aktif','Nonaktif') DEFAULT 'Aktif',
  `avatar` varchar(500) DEFAULT NULL,
  `expertise` varchar(255) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Dispatcher Medis','dispatcher@ring-satu.id','0811-0000-1111','Admin/Dispatcher','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Aktif','',NULL,NULL,'2026-01-09 14:58:09','2026-01-09 14:58:09'),(2,'Tim Ambulance Alpha','alpha@ambulance.id','0812-5555-6666','Tim Ambulance','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Aktif','','Advanced Life Support (ALS)',NULL,'2026-01-09 14:58:09','2026-01-09 14:58:09'),(3,'Tim Ambulance Beta','beta@ambulance.id','0812-5555-7777','Tim Ambulance','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Aktif','','Basic Life Support (BLS)',NULL,'2026-01-09 14:58:09','2026-01-09 14:58:09'),(4,'Kepala Dinas Kesehatan','pimpinan@dinkes.go.id','0811-2222-3333','Pimpinan/Kepala RS','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Aktif','',NULL,NULL,'2026-01-09 14:58:09','2026-01-09 14:58:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-09 21:58:14
