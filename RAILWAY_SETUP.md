# Railway MySQL Setup Guide

This guide will help you connect your dental clinic application to Railway MySQL.

## Step 1: Create MySQL Database on Railway

1. **Sign up/Login to Railway**
   - Go to https://railway.app
   - Sign up or log in with your GitHub account

2. **Create a New Project**
   - Click "New Project"
   - Select "Provision MySQL" or "Add Database" → "MySQL"

3. **Get Connection Details**
   - Once the MySQL service is created, click on it
   - Go to the "Variables" tab
   - You'll see the following environment variables:
     - `MYSQLHOST` - Database host
     - `MYSQLUSER` - Database user
     - `MYSQLPASSWORD` - Database password
     - `MYSQLDATABASE` - Database name
     - `MYSQLPORT` - Database port (usually 3306)

4. **Copy Connection String (Alternative)**
   - Railway also provides a connection string in the "Connect" tab
   - Format: `mysql://user:password@host:port/database`

## Step 2: Update Your .env File

Update your `.env` file with Railway MySQL credentials:

```env
# Railway MySQL Configuration
MYSQLHOST=your_railway_host.railway.app
MYSQLUSER=root
MYSQLPASSWORD=your_railway_password
MYSQLDATABASE=railway
MYSQLPORT=3306

# Or use the standard format (both work)
DB_HOST=your_railway_host.railway.app
DB_USER=root
DB_PASSWORD=your_railway_password
DB_NAME=railway
DB_PORT=3306

# Server Port
PORT=3000

# Optional: Set this to enable SSL
RAILWAY_ENVIRONMENT=true
```

**Important:** Replace the placeholder values with your actual Railway MySQL credentials.

## Step 3: Initialize Database Schema

You need to create the tables on Railway MySQL. You have two options:

### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI** (if not already installed):
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link your project**:
   ```bash
   railway link
   ```

4. **Run the SQL script**:
   ```bash
   railway connect mysql < server/init-db.sql
   ```

### Option B: Using MySQL Client

1. **Get the connection string from Railway** (in the "Connect" tab)

2. **Connect using MySQL client**:
   ```bash
   mysql -h your_railway_host.railway.app -u root -p -P 3306 railway
   ```

3. **Run the SQL script**:
   ```sql
   source server/init-db.sql
   ```
   Or copy and paste the contents of `server/init-db.sql` into the MySQL client.

### Option C: Using a Database GUI Tool

Use tools like:
- **MySQL Workbench**
- **TablePlus**
- **DBeaver**
- **Sequel Pro** (Mac)

Connect using Railway's connection details and run the SQL script.

## Step 4: Create Admin User

After initializing the database, create an admin user:

```sql
INSERT INTO users (username, password, role, createdAt) 
VALUES ('admin', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin', NOW())
ON DUPLICATE KEY UPDATE username='admin';
```

Or use the provided script:
```bash
# If using Railway CLI
railway connect mysql < server/create-admin-user.sql
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## Step 5: Test the Connection

1. **Start your server**:
   ```bash
   npm run start:server
   ```

2. **Check the console** - You should see:
   ```
   ✅ Connected to MySQL database
   🚀 Server running on http://localhost:3000
   ```

3. **Test the API**:
   ```bash
   curl http://localhost:3000/api/health
   ```

## Step 6: Update MCP Server (Optional)

If you're using the MCP server, update its configuration to use Railway MySQL as well. The MCP server will automatically use the same environment variables.

## Troubleshooting

### Connection Refused
- Check that Railway MySQL service is running
- Verify the host, port, and credentials are correct
- Ensure your IP is whitelisted (Railway usually allows all IPs by default)

### SSL Connection Error
- The code is configured to handle Railway's SSL certificates
- If you still get SSL errors, check that `ssl: { rejectUnauthorized: false }` is set in `database.js`

### Authentication Failed
- Double-check your `MYSQLPASSWORD` or `DB_PASSWORD` in `.env`
- Make sure there are no extra spaces or quotes

### Database Doesn't Exist
- Railway creates a default database (usually named `railway`)
- You can use that database or create a new one
- Update `MYSQLDATABASE` or `DB_NAME` accordingly

### Tables Don't Exist
- Make sure you ran `server/init-db.sql` on Railway MySQL
- Verify the database name matches in your `.env` file

## Switching Between Local and Railway

You can easily switch between local MySQL and Railway MySQL by updating your `.env` file:

**For Local MySQL:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=dental_clinic
```

**For Railway MySQL:**
```env
MYSQLHOST=your_railway_host.railway.app
MYSQLUSER=root
MYSQLPASSWORD=your_railway_password
MYSQLDATABASE=railway
```

The code automatically detects which format you're using!

## Next Steps

- Your application is now connected to Railway MySQL
- All data will be stored in the cloud
- You can deploy your application to Railway as well for a fully cloud-based solution

