# Database Connection Troubleshooting Guide

## Quick Checklist

If you're getting `ECONNREFUSED` or connection errors, check these in order:

### ✅ Step 1: Verify Environment Variables in Render

1. Go to **Render Dashboard** → Your Service → **Environment** tab
2. Verify these variables exist and have correct values:

```
MYSQLHOST=shuttle.proxy.rlwy.net
MYSQLPORT=45417
MYSQLUSER=root
MYSQLPASSWORD=qvJEzIDOevornwSiaUBXQuUNbLCGOsii
MYSQLDATABASE=railway
RAILWAY_ENVIRONMENT=true
```

**Common mistakes:**
- ❌ Variable name has typo (e.g., `MYSQL_HOST` instead of `MYSQLHOST`)
- ❌ Value has extra spaces
- ❌ Using quotes around values (not needed in Render)
- ❌ Port is a string instead of number (should be `45417` not `"45417"`)

### ✅ Step 2: Check Render Logs

After deployment, check the logs. You should see:

```
🔌 Database Configuration:
   Host: shuttle.proxy.rlwy.net
   Port: 45417
   ...
```

If you see:
```
⚠️  WARNING: No database host configured, using localhost
```

Then environment variables are NOT being read. Go back to Step 1.

### ✅ Step 3: Verify Railway MySQL is Running

1. Go to **Railway Dashboard**
2. Check your MySQL service is **Running** (green status)
3. If it's stopped, start it

### ✅ Step 4: Verify Railway Connection String

1. In Railway, go to your MySQL service
2. Click **"Connect"** or **"Data"** tab
3. Copy the connection string
4. Verify it matches what you set in Render:
   - Host should be: `shuttle.proxy.rlwy.net` (or similar)
   - Port should be: `45417` (or the port shown)
   - User should be: `root`
   - Database should be: `railway`

### ✅ Step 5: Test Connection from Render

The updated code now shows detailed diagnostics. Check your Render logs for:

```
🔍 Environment Variables Check:
   MYSQLHOST: shuttle.proxy.rlwy.net
   MYSQLPORT: 45417
   ...
```

If any show "NOT SET", that's your problem.

## Common Error Messages

### `ECONNREFUSED ::1:3306` or `ECONNREFUSED 127.0.0.1:3306`

**Meaning:** Trying to connect to localhost instead of Railway

**Fix:**
1. Environment variables are not set in Render
2. Go to Render → Environment tab
3. Add all MYSQL* variables
4. Save and redeploy

### `ETIMEDOUT`

**Meaning:** Connection timeout - can't reach the database

**Possible causes:**
1. Railway MySQL service is stopped
2. Firewall blocking connection
3. Wrong hostname/port
4. Network issues

**Fix:**
1. Check Railway MySQL is running
2. Verify hostname and port in Railway dashboard
3. Update environment variables if needed

### `ER_ACCESS_DENIED_ERROR`

**Meaning:** Wrong username or password

**Fix:**
1. Check Railway dashboard for correct credentials
2. Update MYSQLUSER and MYSQLPASSWORD in Render
3. Make sure no extra spaces in values

## Debug Steps

### 1. Check What Render Sees

After deployment, look for this in Render logs:

```
🔍 Environment Variables Check:
   MYSQLHOST: [should show your Railway host]
   MYSQLPORT: [should show 45417]
   ...
```

If any show "NOT SET", add them in Render.

### 2. Verify Connection Details

Look for this in logs:

```
📋 Connection Details:
   Attempting to connect to: shuttle.proxy.rlwy.net:45417
```

If it shows `localhost:3306`, environment variables aren't set.

### 3. Test Locally First

Before deploying to Render, test locally:

1. Set environment variables in your `.env` file
2. Run: `npm run start:server`
3. Check if connection works locally
4. If it works locally but not on Render, it's an environment variable issue

## Still Not Working?

1. **Double-check variable names** - They must be exact:
   - `MYSQLHOST` (not `MYSQL_HOST`)
   - `MYSQLPORT` (not `MYSQL_PORT`)
   - etc.

2. **Check for typos** in values

3. **Verify Railway MySQL** is accessible:
   - Try connecting with a MySQL client
   - Use the connection string from Railway

4. **Check Render service logs** for the detailed error messages

5. **Redeploy** after making changes:
   - Render auto-redeploys when you save environment variables
   - But you can manually trigger a redeploy

## Need More Help?

Share these from your Render logs:
1. The "🔍 Environment Variables Check" section
2. The "📋 Connection Details" section
3. The full error message

This will help identify the exact issue.

