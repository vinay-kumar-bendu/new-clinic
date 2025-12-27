require('dotenv').config();
const mysql = require('mysql2/promise');

// Database configuration - supports both local and Railway MySQL
// Railway provides: MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'dental_clinic',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Railway MySQL requires SSL
  ssl: (process.env.MYSQLHOST || process.env.RAILWAY_ENVIRONMENT) ? {
    rejectUnauthorized: false // Railway uses self-signed certificates
  } : false
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    console.log('💡 Make sure MySQL is running and database exists');
  });

module.exports = pool;

