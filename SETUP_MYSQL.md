# MySQL Database Setup Guide

## Step 1: Install and Start MySQL

Make sure MySQL is installed and running on your system.

## Step 2: Create Database and Tables

Run the SQL script to create the database:

```bash
mysql -u root -p < server/init-db.sql
```

Or connect to MySQL and run:
```bash
mysql -u root -p
```
Then:
```sql
source server/init-db.sql
```

## Step 3: Configure Database Connection

Create a `.env` file in the root directory (copy from `.env.example`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dental_clinic
PORT=3000
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Start the Servers

### Option 1: Start Both Servers Together
```bash
npm run start:dev
```
This will start:
- Angular dev server on `http://localhost:4200`
- API server on `http://localhost:3000`

### Option 2: Start Separately

Terminal 1 - Angular:
```bash
npm start
```

Terminal 2 - API Server:
```bash
npm run start:server
```

## Step 6: Test the Connection

1. Check API health: http://localhost:3000/api/health
2. You should see: `{"status":"OK","message":"Dental Clinic API is running"}`

## Default Login Credentials

- Username: `admin`
- Password: `admin123`

## Troubleshooting

### Database Connection Error
- Make sure MySQL is running: `mysql -u root -p`
- Check your `.env` file has correct credentials
- Verify database exists: `SHOW DATABASES;`

### Port Already in Use
- Change PORT in `.env` file
- Or stop the process using port 3000

### CORS Errors
- Make sure API server is running on port 3000
- Check browser console for specific errors

## Next Steps

Once the database is set up, the Angular services will automatically use the MySQL database instead of localStorage. All your data will be stored in MySQL!



