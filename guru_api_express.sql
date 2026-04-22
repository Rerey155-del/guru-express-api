-- Create Database
CREATE DATABASE IF NOT EXISTS guru_express_api;
USE guru_express_api;

-- Drop Tables if they exist for a clean start (Optional)
-- DROP TABLE IF EXISTS schedules;
-- DROP TABLE IF EXISTS classes;
-- DROP TABLE IF EXISTS subjects;
-- DROP TABLE IF EXISTS students;
-- DROP TABLE IF EXISTS teachers;
-- DROP TABLE IF EXISTS users;

-- 1. Users (Admin)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'Admin',
    status ENUM('Aktif', 'Non-Aktif') DEFAULT 'Aktif',
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Teachers
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nip VARCHAR(25) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    status ENUM('Aktif', 'Non-Aktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nis VARCHAR(25) NOT NULL UNIQUE,
    gender ENUM('Laki-laki', 'Perempuan') NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    enrollment_status ENUM('Aktif', 'Lulus', 'Keluar') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    academic_code VARCHAR(25) NOT NULL UNIQUE,
    metadata TEXT NULL, -- Tags/Description
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Classes
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_designation VARCHAR(50) NOT NULL UNIQUE,
    room_id VARCHAR(50) NOT NULL,
    utilization VARCHAR(25) NOT NULL, -- Format: current/max
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Schedules
CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL,
    day VARCHAR(20) NOT NULL,
    period_duration VARCHAR(50) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Users
INSERT INTO users (full_name, username, email, role, status) VALUES 
('Admin Utama', 'admin', 'admin@school.id', 'Super Admin', 'Aktif'),
('Budi Operator', 'budi_ops', 'budi.ops@school.id', 'Admin', 'Aktif'),
('Siti Kurikulum', 'siti_kur', 'siti.kur@school.id', 'Admin', 'Aktif'),
('Andi TU', 'andi_tu', 'andi.tu@school.id', 'Admin', 'Non-Aktif'),
('Dewi Akademik', 'dewi_aka', 'dewi.aka@school.id', 'Admin', 'Aktif');

-- Insert Teachers
INSERT INTO teachers (name, nip, email, department, status) VALUES 
('Budi Santoso', '198501012010011001', 'budi@school.id', 'Matematika', 'Aktif'),
('Ani Wijaya', '198802022012012002', 'ani@school.id', 'Bahasa Inggris', 'Aktif'),
('Siti Aminah', '198203032008012003', 'siti@school.id', 'Fisika', 'Aktif'),
('Hendro Gunawan', '197504042000031004', 'hendro@school.id', 'Biologi', 'Aktif'),
('Maya Sari', '199005052015012005', 'maya@school.id', 'Kimia', 'Aktif'),
('Rudi Hermawan', '198006062005011006', 'rudi.h@school.id', 'Sejarah', 'Aktif'),
('Lina Marlina', '199207072018012007', 'lina.m@school.id', 'Geografi', 'Aktif'),
('Eko Prasetyo', '198708082011011008', 'eko.p@school.id', 'Ekonomi', 'Aktif'),
('Nina Kartika', '198409092009012009', 'nina.k@school.id', 'Sosiologi', 'Aktif'),
('Dedi Kurniawan', '197810102003121010', 'dedi.k@school.id', 'Olahraga', 'Non-Aktif');

-- Insert Students
INSERT INTO students (name, nis, gender, class_name, enrollment_status) VALUES 
('Rizky Pratama', '12345', 'Laki-laki', '10-A', 'Aktif'),
('Aulia Putri', '12346', 'Perempuan', '10-A', 'Aktif'),
('Bambang Pamungkas', '12347', 'Laki-laki', '10-B', 'Aktif'),
('Citra Lestari', '12348', 'Perempuan', '10-B', 'Aktif'),
('Diki Wahyudi', '12349', 'Laki-laki', '11-IPA-1', 'Aktif'),
('Eka Saputra', '12350', 'Laki-laki', '11-IPA-1', 'Aktif'),
('Fitri Handayani', '12351', 'Perempuan', '11-IPA-2', 'Aktif'),
('Gani Rahman', '12352', 'Laki-laki', '11-IPS-1', 'Aktif'),
('Hana Sofia', '12353', 'Perempuan', '11-IPS-2', 'Aktif'),
('Indra Wijaya', '12354', 'Laki-laki', '12-IPA-1', 'Aktif'),
('Julia Perez', '12355', 'Perempuan', '12-IPA-2', 'Aktif'),
('Kurnia Sandi', '12356', 'Laki-laki', '12-IPS-1', 'Aktif'),
('Laraswati', '12357', 'Perempuan', '12-IPS-2', 'Aktif');

-- Insert Subjects
INSERT INTO subjects (subject_name, academic_code, metadata) VALUES 
('Matematika', 'MATH101', 'Wajib, Sains'),
('Bahasa Inggris', 'ENGL101', 'Wajib, Bahasa'),
('Fisika', 'PHYS101', 'Sains, IPA'),
('Biologi', 'BIOL101', 'Sains, IPA'),
('Kimia', 'CHEM101', 'Sains, IPA'),
('Sejarah', 'HIST101', 'IPS, Sosial'),
('Geografi', 'GEOG101', 'IPS, Sosial'),
('Ekonomi', 'ECON101', 'IPS, Sosial'),
('Sosiologi', 'SOCI101', 'IPS, Sosial'),
('Penjasorkes', 'SPRT101', 'Wajib, Olahraga');

-- Insert Classes
INSERT INTO classes (class_designation, room_id, utilization) VALUES 
('10-A', 'R101', '32/36'),
('10-B', 'R102', '30/36'),
('11-IPA-1', 'R201', '28/32'),
('11-IPA-2', 'R202', '29/32'),
('11-IPS-1', 'R203', '34/36'),
('11-IPS-2', 'R204', '33/36'),
('12-IPA-1', 'R301', '25/30'),
('12-IPA-2', 'R302', '26/30'),
('12-IPS-1', 'R303', '35/36'),
('12-IPS-2', 'R304', '34/36');

-- Insert Schedules
INSERT INTO schedules (class_name, day, period_duration, instructor, subject) VALUES 
('10-A', 'Senin', '07:30 - 09:00', 'Budi Santoso', 'Matematika'),
('10-A', 'Senin', '09:15 - 10:45', 'Ani Wijaya', 'Bahasa Inggris'),
('10-B', 'Senin', '07:30 - 09:00', 'Siti Aminah', 'Fisika'),
('11-IPA-1', 'Selasa', '07:30 - 09:30', 'Hendro Gunawan', 'Biologi'),
('11-IPS-1', 'Selasa', '10:00 - 12:00', 'Rudi Hermawan', 'Sejarah'),
('12-IPA-1', 'Rabu', '08:00 - 10:00', 'Maya Sari', 'Kimia'),
('12-IPS-2', 'Kamis', '07:30 - 09:30', 'Lina Marlina', 'Geografi'),
('10-B', 'Jumat', '08:00 - 09:30', 'Dedi Kurniawan', 'Olahraga'),
('11-IPA-2', 'Rabu', '10:00 - 12:00', 'Maya Sari', 'Kimia'),
('12-IPS-1', 'Selasa', '08:00 - 10:00', 'Eko Prasetyo', 'Ekonomi');
