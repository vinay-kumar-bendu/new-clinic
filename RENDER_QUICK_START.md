# Quick Render Deployment Guide

## 🚀 Quick Fix for Memory Error

The memory error occurs because Render is running `npm run start` which starts the Angular development server (`ng serve`). This is very memory-intensive and not for production.

## Solution: Use Production Server

### Step 1: Update Build Command in Render

In your Render service settings, change the **Build Command** to:

```bash
NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:client
```

### Step 2: Start Command (Optional)

The **Start Command** can now be:
```bash
npm run start
```

This now defaults to the production server (serves built static files). No need to change it in Render!

**Note:** If Render still shows the old command, you can leave it as `npm run start` - it will now work correctly.

### Step 3: Environment Variables

Add these environment variables in Render:

**For Backend API:**
```
NODE_ENV=production
PORT=3000
MYSQLHOST=shuttle.proxy.rlwy.net
MYSQLUSER=root
MYSQLPASSWORD=your_password
MYSQLDATABASE=railway
MYSQLPORT=45417
RAILWAY_ENVIRONMENT=true
```

**For Frontend (if deploying separately):**
```
NODE_ENV=production
```

## Deployment Options

### Option A: Two Separate Services (Recommended)

1. **Backend Service (Web Service)**
   - Build Command: `npm install`
   - Start Command: `npm run start:server`
   - Plan: Free or Starter

2. **Frontend Service (Static Site)**
   - Build Command: `NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:client`
   - Publish Directory: `dist/todo/browser`
   - Plan: Free

### Option B: Single Service (Recommended for Simplicity)

1. **Web Service**
   - Build Command: `NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:client`
   - Start Command: `npm run start:prod` (or `node server/server.js`)
   - Plan: Starter ($7/month) or higher
   - The server now serves both API and frontend from one service

## If Still Getting Memory Errors

1. **Upgrade Render Plan:**
   - Free: 512MB
   - Starter: 512MB (better performance)
   - Standard: 2GB ($25/month)

2. **Build Locally and Deploy:**
   ```bash
   npm run build:client
   # Then push only dist/ folder
   ```

3. **Use GitHub Actions:**
   - Build in GitHub Actions (more memory)
   - Deploy built files to Render

## Test Build Locally

Test the optimized build locally:

```bash
NODE_OPTIONS='--max-old-space-size=1024' npm run build:client
```

This should complete successfully with less memory usage.

