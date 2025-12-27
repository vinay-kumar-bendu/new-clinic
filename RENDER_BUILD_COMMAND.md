# ⚠️ URGENT: Update Build Command in Render

## Your Current Issue

Render is running `npm run build` which calls `ng build`, but `ng` is not found.

## Quick Fix - Update Build Command

### Step 1: Go to Render Settings

1. Go to https://render.com
2. Click on your service
3. Click **"Settings"** tab

### Step 2: Update Build Command

Find the **"Build Command"** field and **REPLACE** it with:

```bash
NODE_OPTIONS='--max-old-space-size=1024' npm install && npx ng build --configuration=client
```

**OR** (alternative):

```bash
NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:client
```

### Step 3: Save and Wait

1. Click **"Save Changes"**
2. Render will automatically redeploy
3. Wait for build to complete (2-5 minutes)

## Why This Happens

- Render might auto-detect `npm run build` as the build command
- `npm run build` calls `ng build` directly
- But `ng` command is not in PATH - it's in `node_modules/.bin/`
- Using `npx ng` or `npm run build:client` fixes this

## Verify It's Working

After updating, check the build logs. You should see:

```
📦 Installing dependencies...
🔨 Building Angular application...
✔ Building...
Application bundle generation complete.
✅ Build complete!
```

## If Still Not Working

1. **Check the exact error** in Render logs
2. **Verify Node.js version** - should be 18+
3. **Try the alternative command** above
4. **Check if dependencies are installing** - look for "npm install" in logs

## Current Build Command Should Be

**NOT THIS:**
```bash
npm run build  ❌
```

**USE THIS:**
```bash
NODE_OPTIONS='--max-old-space-size=1024' npm install && npx ng build --configuration=client  ✅
```

