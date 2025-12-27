-- Create admin user and grant permissions
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'Vinay@1433';
GRANT ALL PRIVILEGES ON dental_clinic.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;

-- Verify user creation
SELECT User, Host FROM mysql.user WHERE User = 'admin';



