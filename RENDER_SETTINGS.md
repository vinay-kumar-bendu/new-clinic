# Render Service Settings - Copy & Paste

## ⚠️ CRITICAL: Update Your Render Service Settings

The memory error happens because Render is running the development server. Update these settings:

## Single Service Configuration (Backend + Frontend)

### Service Settings:

**Name:** `dental-clinic` (or any name you prefer)

**Environment:** `Node`

**Build Command:**
```bash
NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:client
```

**Start Command:**
```bash
npm run start
```

(Now defaults to production server - no need to specify `start:prod`)

**Plan:** Starter ($7/month) or Standard ($25/month) - Free tier has 512MB which may not be enough

### Environment Variables:

**⚠️ CRITICAL: You MUST set these in Render's Environment tab!**

See **`RENDER_ENV_VARS.md`** for detailed step-by-step instructions.

Quick reference:
```
NODE_ENV=production
PORT=3000
MYSQLHOST=shuttle.proxy.rlwy.net
MYSQLUSER=root
MYSQLPASSWORD=qvJEzIDOevornwSiaUBXQuUNbLCGOsii
MYSQLDATABASE=railway
MYSQLPORT=45417
RAILWAY_ENVIRONMENT=true
```

**Without these variables, you'll get: `connect ECONNREFUSED ::1:3306`**

## What This Does

1. **Build Command:**
   - Installs dependencies
   - Builds Angular app in client-only mode (no SSR, less memory)
   - Outputs to `dist/todo/browser`

2. **Start Command:**
   - Runs Express server (`server/server.js`)
   - Serves API at `/api/*`
   - Serves Angular frontend for all other routes
   - Much less memory than `ng serve`

## After Updating Settings

1. Save the settings
2. Render will automatically redeploy
3. Check the logs to verify it's working
4. Visit your service URL

## Verify It's Working

After deployment, you should see in the logs:
```
📁 Serving static files from: /opt/render/project/src/dist/todo/browser
🚀 Server running on http://localhost:3000
📊 API available at http://localhost:3000/api
🌐 Frontend available at http://localhost:3000
```

## Troubleshooting

### Still Getting Memory Error?

1. **Check the Start Command** - Make sure it's `npm run start:prod` NOT `npm run start`
2. **Upgrade Plan** - Free tier only has 512MB, upgrade to Starter or Standard
3. **Check Build** - Make sure build completes successfully before start command runs

### Build Fails?

- Check Node.js version (should be 18+)
- Check build logs for specific errors
- Try building locally first: `npm run build:client`

### Server Starts But Frontend Not Loading?

- Check that build output exists: `dist/todo/browser/index.html`
- Check server logs for static file path
- Verify the output path in `angular.json` matches `dist/todo/browser`

