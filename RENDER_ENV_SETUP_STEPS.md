# ⚠️ URGENT: Set Environment Variables in Render

## Your Current Issue

The logs show **ALL environment variables are NOT SET** in Render. That's why it's trying to connect to `localhost:3306` instead of Railway MySQL.

## Step-by-Step Fix (Do This Now)

### Step 1: Go to Render Dashboard

1. Open https://render.com
2. Log in to your account
3. Click on your service (the one running your application)

### Step 2: Open Environment Tab

1. In the left sidebar, click **"Environment"**
2. You'll see a list of environment variables (probably empty or has only a few)

### Step 3: Add Each Environment Variable

Click **"Add Environment Variable"** button and add these **ONE BY ONE**:

#### Variable 1: MYSQLHOST
- **Key:** `MYSQLHOST`
- **Value:** `shuttle.proxy.rlwy.net`
- Click **"Save"**

#### Variable 2: MYSQLPORT
- **Key:** `MYSQLPORT`
- **Value:** `45417`
- Click **"Save"**

#### Variable 3: MYSQLUSER
- **Key:** `MYSQLUSER`
- **Value:** `root`
- Click **"Save"**

#### Variable 4: MYSQLPASSWORD
- **Key:** `MYSQLPASSWORD`
- **Value:** `qvJEzIDOevornwSiaUBXQuUNbLCGOsii`
- Click **"Save"**

#### Variable 5: MYSQLDATABASE
- **Key:** `MYSQLDATABASE`
- **Value:** `railway`
- Click **"Save"**

#### Variable 6: RAILWAY_ENVIRONMENT
- **Key:** `RAILWAY_ENVIRONMENT`
- **Value:** `true`
- Click **"Save"**

#### Variable 7: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click **"Save"**

#### Variable 8: PORT
- **Key:** `PORT`
- **Value:** `3000`
- Click **"Save"**

### Step 4: Verify All Variables Are Added

After adding all variables, you should see 8 variables in the list:

1. ✅ MYSQLHOST
2. ✅ MYSQLPORT
3. ✅ MYSQLUSER
4. ✅ MYSQLPASSWORD
5. ✅ MYSQLDATABASE
6. ✅ RAILWAY_ENVIRONMENT
7. ✅ NODE_ENV
8. ✅ PORT

### Step 5: Wait for Auto-Redeploy

- Render will **automatically redeploy** your service after you save environment variables
- Wait for the deployment to complete (usually 2-5 minutes)
- You'll see a notification when it's done

### Step 6: Check the Logs

After deployment completes:

1. Go to **"Logs"** tab in Render
2. Look for the new deployment logs
3. You should now see:

```
🔌 Database Configuration:
   Host: shuttle.proxy.rlwy.net
   Port: 45417
   Database: railway
   User: root
   SSL: Enabled

🔍 Environment Variables Check:
   MYSQLHOST: shuttle.proxy.rlwy.net
   MYSQLPORT: 45417
   MYSQLUSER: root
   MYSQLDATABASE: railway
   MYSQLPASSWORD: SET (hidden)
   RAILWAY_ENVIRONMENT: true

✅ Connected to MySQL database
```

## Common Mistakes to Avoid

❌ **Don't add quotes** around values (Render doesn't need them)
❌ **Don't add spaces** before or after values
❌ **Don't use wrong variable names** (must be exact: `MYSQLHOST` not `MYSQL_HOST`)
❌ **Don't forget to save** after adding each variable
❌ **Don't use the wrong port** - it's `45417` not `3306`

## Quick Reference - Copy These Exactly

```
MYSQLHOST=shuttle.proxy.rlwy.net
MYSQLPORT=45417
MYSQLUSER=root
MYSQLPASSWORD=qvJEzIDOevornwSiaUBXQuUNbLCGOsii
MYSQLDATABASE=railway
RAILWAY_ENVIRONMENT=true
NODE_ENV=production
PORT=3000
```

## Still Not Working?

If after setting all variables you still see "NOT SET" in logs:

1. **Double-check variable names** - They must be exact (case-sensitive)
2. **Verify you saved** - Each variable needs to be saved individually
3. **Check for typos** - Especially in the hostname
4. **Wait for redeploy** - Changes take effect after redeployment
5. **Check if you're looking at the right service** - Make sure you're in the correct Render service

## Need Help?

If you're still having issues, share:
1. A screenshot of your Render Environment tab (with values hidden)
2. The latest logs showing the Environment Variables Check section

