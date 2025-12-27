# Render Deployment Guide

This guide will help you deploy your dental clinic application to Render.

## Memory Optimization

The application has been optimized to reduce memory usage during build:
- Client-only build (no SSR) - uses ~70% less memory
- Increased Node.js memory limit to 1GB
- Optimized build configuration

## Deployment Options

### Option 1: Separate Services (Recommended)

Deploy the frontend and backend as separate services:

#### Backend API Service

1. **Create a new Web Service** in Render
2. **Settings:**
   - **Name:** `dental-clinic-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start:server`
   - **Plan:** Free or Starter ($7/month)

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   MYSQLHOST=your_railway_host
   MYSQLUSER=root
   MYSQLPASSWORD=your_password
   MYSQLDATABASE=railway
   MYSQLPORT=45417
   RAILWAY_ENVIRONMENT=true
   ```

#### Frontend Static Site

1. **Create a new Static Site** in Render
2. **Settings:**
   - **Name:** `dental-clinic-frontend`
   - **Build Command:** `NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:render`
   - **Publish Directory:** `dist/todo/browser`
   - **Plan:** Free

3. **Environment Variables:**
   - Add `REACT_APP_API_URL` or `API_URL` pointing to your backend service URL
   - Example: `API_URL=https://dental-clinic-api.onrender.com`

### Option 2: Single Service (Alternative)

If you want to deploy as a single service:

1. **Create a new Web Service** in Render
2. **Settings:**
   - **Name:** `dental-clinic`
   - **Environment:** `Node`
   - **Build Command:** `NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:render`
   - **Start Command:** `npm run start:server`
   - **Plan:** Starter ($7/month) or higher (for more memory)

3. **Update `server/server.js`** to serve static files:
   ```javascript
   // Add this before API routes
   app.use(express.static(path.join(__dirname, '../dist/todo/browser')));
   
   // Add catch-all route for Angular
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../dist/todo/browser/index.html'));
   });
   ```

## Build Commands

### For Render (Memory Optimized):
```bash
NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:render
```

### For Local Testing:
```bash
npm run build:client
```

## Troubleshooting

### "Ran out of memory" Error

If you still get memory errors:

1. **Upgrade Render Plan:**
   - Free tier: 512MB
   - Starter: 512MB (but better performance)
   - Standard: 2GB ($25/month)

2. **Use Separate Build Service:**
   - Build locally and push only `dist/` folder
   - Or use GitHub Actions to build and deploy

3. **Further Optimize:**
   - Remove unused dependencies
   - Disable source maps in production
   - Use `--aot` flag (already enabled)

### Build Fails

1. **Check Node.js Version:**
   - Render uses Node 18+ by default
   - Add `.nvmrc` file with your Node version

2. **Check Dependencies:**
   - Ensure all dependencies are in `package.json`
   - Remove `node_modules` and reinstall

3. **Check Build Logs:**
   - Review Render build logs for specific errors

### API Connection Issues

1. **CORS Configuration:**
   - Update CORS in `server/server.js` to allow your Render frontend URL
   - Add: `res.header('Access-Control-Allow-Origin', 'https://your-frontend.onrender.com');`

2. **Environment Variables:**
   - Ensure all MySQL credentials are set correctly
   - Test database connection locally first

## Recommended Setup

1. **Backend:** Web Service (Starter plan - $7/month)
2. **Frontend:** Static Site (Free)
3. **Database:** Railway MySQL (already set up)

Total Cost: ~$7/month

## Quick Deploy

1. Push your code to GitHub
2. Connect GitHub repo to Render
3. Use the settings from this guide
4. Deploy!

For detailed Render documentation, visit: https://render.com/docs

