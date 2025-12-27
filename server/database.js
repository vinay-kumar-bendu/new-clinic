require('dotenv').config();
const mysql = require('mysql2/promise');

// Database configuration - supports both local and Railway MySQL
// Railway provides: MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'dental_clinic',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Railway MySQL requires SSL
  ssl: (process.env.MYSQLHOST || process.env.RAILWAY_ENVIRONMENT) ? {
    rejectUnauthorized: false // Railway uses self-signed certificates
  } : false
};

// Log connection details (without password)
console.log('🔌 Database Configuration:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   SSL: ${dbConfig.ssl ? 'Enabled' : 'Disabled'}`);
if (!process.env.MYSQLHOST && !process.env.DB_HOST) {
  console.log('⚠️  WARNING: No database host configured, using localhost');
  console.log('   Set MYSQLHOST or DB_HOST environment variable');
}

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
    console.log('💡 Troubleshooting:');
    console.log('   1. Check environment variables are set:');
    console.log('      - MYSQLHOST or DB_HOST');
    console.log('      - MYSQLUSER or DB_USER');
    console.log('      - MYSQLPASSWORD or DB_PASSWORD');
    console.log('      - MYSQLDATABASE or DB_NAME');
    console.log('      - MYSQLPORT or DB_PORT');
    console.log('   2. Verify database is accessible from this network');
    console.log('   3. Check firewall/security group settings');
  });

module.exports = pool;

