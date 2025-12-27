# Fix for Render Memory Error - Start Command

## Problem
Render is running `npm run start` which executes `ng serve` (development server), causing memory errors.

## Solution
Update your Render service to use the production start command.

## Render Service Settings

### For Single Service (Backend + Frontend):

1. **Build Command:**
   ```bash
   NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:client
   ```

2. **Start Command:**
   ```bash
   npm run start:prod
   ```
   **OR**
   ```bash
   node server/server.js
   ```

3. **Environment Variables:**
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

### For Separate Services:

#### Backend Service:
- **Build Command:** `npm install`
- **Start Command:** `npm run start:server`
- **Plan:** Free or Starter

#### Frontend Service (Static Site):
- **Build Command:** `NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:client`
- **Publish Directory:** `dist/todo/browser`
- **Plan:** Free

## What Changed

1. **Updated `server/server.js`:**
   - Now serves static Angular files from `dist/todo/browser`
   - Handles all non-API routes by serving `index.html`
   - Works in production mode

2. **Added `start:prod` script:**
   - Runs the Express server which serves both API and frontend

## Testing Locally

1. Build the Angular app:
   ```bash
   npm run build:client
   ```

2. Start the production server:
   ```bash
   npm run start:prod
   ```

3. Visit: http://localhost:3000

## Important Notes

- The server will serve the built Angular app from `dist/todo/browser`
- API endpoints are available at `/api/*`
- All other routes serve the Angular app (for client-side routing)
- Make sure to run the build command before starting the server

