# Fix: "ng: not found" Build Error

## Problem

Render build is failing with:
```
sh: 1: ng: not found
==> Build failed 😞
```

## Solution

The `ng` command is not available directly. Use `npx` to run it, or use the npm script.

## Update Your Build Command in Render

Go to **Render → Your Service → Settings → Build Command** and change it to:

### Option 1: Using npx (Recommended)
```bash
NODE_OPTIONS='--max-old-space-size=1024' npm install && npx ng build --configuration=client
```

### Option 2: Using npm script
```bash
NODE_OPTIONS='--max-old-space-size=1024' npm install && npm run build:client
```

### Option 3: Using the build script
```bash
chmod +x build-render.sh && ./build-render.sh
```

## Why This Happens

- Angular CLI (`@angular/cli`) is in `devDependencies`
- After `npm install`, `ng` is in `node_modules/.bin/`
- `npx` automatically finds and runs commands from `node_modules/.bin/`
- Or use `npm run` which also finds commands in `node_modules/.bin/`

## Steps to Fix

1. **Go to Render Dashboard**
   - Open your service
   - Click **"Settings"** tab

2. **Update Build Command**
   - Find **"Build Command"** field
   - Replace with one of the options above
   - **Save Changes**

3. **Wait for Redeploy**
   - Render will automatically redeploy
   - Check the build logs
   - Should see: `✔ Building...` and `Application bundle generation complete`

## Verify It's Working

After redeploy, check the logs. You should see:
```
📦 Installing dependencies...
🔨 Building Angular application...
✔ Building...
Application bundle generation complete.
✅ Build complete!
```

If you still see errors, check:
- Node.js version (should be 18+)
- All dependencies are installing correctly
- No memory errors during build

