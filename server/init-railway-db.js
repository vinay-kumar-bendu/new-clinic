/**
 * Script to initialize Railway MySQL database
 * Run this after connecting to Railway MySQL
 * 
 * Usage:
 *   node server/init-railway-db.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  // Database configuration - supports Railway MySQL
  const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'dental_clinic',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    multipleStatements: true, // Allow multiple SQL statements
    ssl: (process.env.MYSQLHOST || process.env.RAILWAY_ENVIRONMENT) ? {
      rejectUnauthorized: false
    } : false
  };

  console.log('🔌 Connecting to MySQL database...');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Port: ${dbConfig.port}`);
  
  // Check if using internal Railway hostname (won't work locally)
  if (dbConfig.host && dbConfig.host.includes('railway.internal')) {
    console.log('\n⚠️  WARNING: Using internal Railway hostname (mysql.railway.internal)');
    console.log('   This only works when running inside Railway.');
    console.log('   For local development, use the PUBLIC hostname from Railway.');
    console.log('   Get it from: Railway Dashboard → MySQL → Connect tab → Public Networking\n');
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database\n');

    // Read and execute the SQL script
    const sqlScriptPath = path.join(__dirname, 'init-db.sql');
    const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

    console.log('📝 Executing database initialization script...');
    await connection.query(sqlScript);
    console.log('✅ Database schema created successfully\n');

    // Create admin user
    console.log('👤 Creating admin user...');
    
    await connection.query(`
      INSERT INTO users (username, password, createdAt) 
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE password = ?
    `, ['admin', 'admin123', 'admin123']);
    
    console.log('✅ Admin user created');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

    console.log('🎉 Database initialization complete!');
    console.log('   You can now start your application with: npm run start:server');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   💡 Check your database credentials in .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   💡 Check that Railway MySQL is running and accessible');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   💡 Database does not exist. Railway should create it automatically.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the initialization
initializeDatabase();

