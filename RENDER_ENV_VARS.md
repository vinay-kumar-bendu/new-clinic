# Render Environment Variables Setup

## ⚠️ URGENT: Set These Environment Variables in Render

**If you see "NOT SET" in your logs, you MUST add these environment variables in Render!**

The database connection error occurs because the Railway MySQL environment variables are not set in Render.

**👉 See `RENDER_ENV_SETUP_STEPS.md` for detailed step-by-step instructions with screenshots guidance.**

## Step-by-Step Instructions

### 1. Go to Your Render Service

1. Log in to https://render.com
2. Go to your service (the one running your application)
3. Click on the service name

### 2. Navigate to Environment Tab

1. Click on **"Environment"** in the left sidebar
2. You'll see a list of environment variables (may be empty)

### 3. Add These Environment Variables

Click **"Add Environment Variable"** and add each of these:

#### Required Variables:

**MYSQLHOST**
```
shuttle.proxy.rlwy.net
```

**MYSQLUSER**
```
root
```

**MYSQLPASSWORD**
```
qvJEzIDOevornwSiaUBXQuUNbLCGOsii
```

**MYSQLDATABASE**
```
railway
```

**MYSQLPORT**
```
45417
```

**RAILWAY_ENVIRONMENT**
```
true
```

**NODE_ENV**
```
production
```

**PORT**
```
3000
```

### 4. Save and Redeploy

1. After adding all variables, click **"Save Changes"**
2. Render will automatically trigger a new deployment
3. Wait for the deployment to complete
4. Check the logs to verify the database connection

## Verify It's Working

After deployment, check the logs. You should see:

```
🔌 Database Configuration:
   Host: shuttle.proxy.rlwy.net
   Port: 45417
   Database: railway
   User: root
   SSL: Enabled
✅ Connected to MySQL database
```

If you see:
```
⚠️  WARNING: No database host configured, using localhost
```

Then the environment variables are not set correctly. Double-check step 3.

## Alternative: Using DB_* Variables

If you prefer, you can use the standard format instead:

**DB_HOST**
```
shuttle.proxy.rlwy.net
```

**DB_USER**
```
root
```

**DB_PASSWORD**
```
qvJEzIDOevornwSiaUBXQuUNbLCGOsii
```

**DB_NAME**
```
railway
```

**DB_PORT**
```
45417
```

The application supports both formats.

## Troubleshooting

### Still Getting Connection Errors?

1. **Verify Variables Are Set:**
   - Go to Environment tab
   - Make sure all variables are listed
   - Check for typos in variable names

2. **Check Variable Values:**
   - Make sure there are no extra spaces
   - Verify the hostname is correct
   - Confirm the port is a number (no quotes)

3. **Check Railway MySQL:**
   - Verify Railway MySQL service is running
   - Check Railway dashboard for any service issues
   - Verify the connection string in Railway

4. **Check Render Logs:**
   - Look for the "Database Configuration" log
   - See what host/port it's trying to connect to
   - Verify SSL is enabled for Railway

### Common Mistakes

- ❌ Forgetting to save after adding variables
- ❌ Typos in variable names (MYSQLHOST not MYSQL_HOST)
- ❌ Extra spaces in values
- ❌ Using quotes around values (not needed)
- ❌ Wrong port number

## Quick Copy-Paste

Here's a quick reference for all variables:

```
MYSQLHOST=shuttle.proxy.rlwy.net
MYSQLUSER=root
MYSQLPASSWORD=qvJEzIDOevornwSiaUBXQuUNbLCGOsii
MYSQLDATABASE=railway
MYSQLPORT=45417
RAILWAY_ENVIRONMENT=true
NODE_ENV=production
PORT=3000
```

Copy each line and add it as a separate environment variable in Render.

