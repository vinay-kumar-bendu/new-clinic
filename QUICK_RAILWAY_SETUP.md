# Quick Railway MySQL Setup

## 🚀 Quick Steps

### 1. Get Railway MySQL Credentials

1. Go to https://railway.app
2. Create/Select a project
3. Add MySQL database service
4. Copy these values from the "Variables" tab:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`

### 2. Update .env File

Add these to your `.env` file:

```env
MYSQLHOST=your_railway_host.railway.app
MYSQLUSER=root
MYSQLPASSWORD=your_railway_password
MYSQLDATABASE=railway
MYSQLPORT=3306
RAILWAY_ENVIRONMENT=true
PORT=3000
```

### 3. Initialize Database

Run this command to create all tables and admin user:

```bash
npm run init-railway-db
```

### 4. Test Connection

Start your server:

```bash
npm run start:server
```

You should see: `✅ Connected to MySQL database`

### 5. Done! 🎉

Your app is now connected to Railway MySQL.

---

**Default Login:**
- Username: `admin`
- Password: `admin123`

For detailed instructions, see `RAILWAY_SETUP.md`

