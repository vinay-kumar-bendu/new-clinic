-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dental_clinic;
USE dental_clinic;

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  dateOfBirth DATE NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  address TEXT,
  emergencyContact VARCHAR(100),
  emergencyPhone VARCHAR(20),
  medicalHistory TEXT,
  allergies TEXT,
  insuranceProvider VARCHAR(100),
  insuranceNumber VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lastVisit DATE,
  INDEX idx_email (email),
  INDEX idx_phone (phone)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  appointmentDate DATE NOT NULL,
  appointmentTime TIME NOT NULL,
  duration INT DEFAULT 30,
  type ENUM('Consultation', 'Cleaning', 'Filling', 'Root Canal', 'Extraction', 'Crown', 'Orthodontic', 'Emergency', 'Follow-up', 'Other') NOT NULL,
  status ENUM('Scheduled', 'Completed', 'Cancelled', 'No Show') DEFAULT 'Scheduled',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_date (appointmentDate),
  INDEX idx_patient (patientId)
);

-- Treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  appointmentId INT,
  treatmentDate DATE NOT NULL,
  toothNumber VARCHAR(50),
  treatmentType ENUM('Cleaning', 'Filling', 'Root Canal', 'Extraction', 'Crown', 'Bridge', 'Implant', 'Orthodontic', 'Whitening', 'Other') NOT NULL,
  description TEXT,
  diagnosis TEXT NOT NULL,
  procedure TEXT NOT NULL,
  notes TEXT,
  nextVisitDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE SET NULL,
  INDEX idx_patient (patientId),
  INDEX idx_date (treatmentDate)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  treatmentId INT,
  appointmentId INT,
  paymentDate DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paymentMethod ENUM('Cash', 'Credit Card', 'Debit Card', 'Insurance', 'Check', 'Online') NOT NULL,
  paymentType ENUM('Full Payment', 'Partial Payment', 'Deposit') NOT NULL,
  description TEXT,
  status ENUM('Paid', 'Pending', 'Refunded') DEFAULT 'Paid',
  invoiceNumber VARCHAR(50) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (treatmentId) REFERENCES treatments(id) ON DELETE SET NULL,
  FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE SET NULL,
  INDEX idx_patient (patientId),
  INDEX idx_invoice (invoiceNumber)
);

-- Users/Credentials table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password) 
VALUES ('admin', 'admin123')
ON DUPLICATE KEY UPDATE username=username;



