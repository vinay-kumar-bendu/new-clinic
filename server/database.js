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

// Test connection with retry logic
let connectionAttempts = 0;
const maxAttempts = 3;

function testConnection() {
  connectionAttempts++;
  pool.getConnection()
    .then(connection => {
      console.log('✅ Connected to MySQL database');
      console.log(`   Connection successful on attempt ${connectionAttempts}`);
      connection.release();
    })
    .catch(err => {
      console.error('❌ Database connection error:', err.message);
      console.error('   Error code:', err.code);
      console.error('   Error errno:', err.errno);
      console.error('   Error syscall:', err.syscall);
      
      // Show what we're trying to connect to
      console.log('\n📋 Connection Details:');
      console.log(`   Attempting to connect to: ${dbConfig.host}:${dbConfig.port}`);
      console.log(`   Database: ${dbConfig.database}`);
      console.log(`   User: ${dbConfig.user}`);
      console.log(`   SSL: ${dbConfig.ssl ? 'Enabled' : 'Disabled'}`);
      
      // Check environment variables
      console.log('\n🔍 Environment Variables Check:');
      console.log(`   MYSQLHOST: ${process.env.MYSQLHOST || 'NOT SET'}`);
      console.log(`   DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
      console.log(`   MYSQLPORT: ${process.env.MYSQLPORT || 'NOT SET'}`);
      console.log(`   DB_PORT: ${process.env.DB_PORT || 'NOT SET'}`);
      console.log(`   MYSQLUSER: ${process.env.MYSQLUSER || 'NOT SET'}`);
      console.log(`   MYSQLDATABASE: ${process.env.MYSQLDATABASE || 'NOT SET'}`);
      console.log(`   MYSQLPASSWORD: ${process.env.MYSQLPASSWORD ? 'SET (hidden)' : 'NOT SET'}`);
      console.log(`   RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'NOT SET'}`);
      
      console.log('\n💡 Troubleshooting:');
      if (err.code === 'ECONNREFUSED') {
        console.log('   ❌ Connection refused - Possible causes:');
        console.log('      1. Database host/port is incorrect');
        console.log('      2. Database server is not running');
        console.log('      3. Firewall blocking the connection');
        console.log('      4. Environment variables not set in Render');
        console.log('      5. Using wrong port (check Railway connection string)');
      } else if (err.code === 'ETIMEDOUT') {
        console.log('   ❌ Connection timeout - Possible causes:');
        console.log('      1. Network connectivity issues');
        console.log('      2. Firewall blocking the connection');
        console.log('      3. Database host is unreachable');
      } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('   ❌ Access denied - Check username and password');
      } else {
        console.log('   ❌ Unknown error - Check the error details above');
      }
      
      console.log('\n📝 Action Items:');
      console.log('   1. Go to Render → Your Service → Environment tab');
      console.log('   2. Verify all MYSQL* variables are set correctly');
      console.log('   3. Check Railway MySQL service is running');
      console.log('   4. Verify the connection string in Railway dashboard');
      console.log('   5. Check Render logs for this detailed error message');
      
      // Retry if not max attempts
      if (connectionAttempts < maxAttempts) {
        console.log(`\n🔄 Retrying connection (attempt ${connectionAttempts + 1}/${maxAttempts})...`);
        setTimeout(testConnection, 2000);
      } else {
        console.log('\n⚠️  Max connection attempts reached. Server will continue but database operations may fail.');
        console.log('   The application will retry connections on each database operation.');
      }
    });
}

// Start connection test
testConnection();

module.exports = pool;

