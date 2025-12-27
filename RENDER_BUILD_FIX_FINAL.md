# Fix: "npm error could not determine executable to run"

## Problem

Getting error:
```
npm error could not determine executable to run
```

This happens when npm can't find the command to execute.

## Solution - Use This Exact Build Command

Go to **Render → Your Service → Settings → Build Command** and use this **EXACT** command:

```bash
npm install && npm run build:client
```

**OR** if you need the memory limit:

```bash
NODE_OPTIONS=--max-old-space-size=1024 npm install && npm run build:client
```

## Why This Works

- `npm run build:client` uses the script defined in `package.json`
- It will automatically use `npx` or find the command in `node_modules/.bin/`
- No need to call `npx ng` directly
- Simpler and more reliable

## Step-by-Step

1. **Go to Render Dashboard**
   - Open your service
   - Click **"Settings"** tab

2. **Find Build Command Field**
   - Scroll to "Build Command"
   - Clear the current value

3. **Paste This Command:**
   ```bash
   npm install && npm run build:client
   ```

4. **Save Changes**
   - Click "Save Changes"
   - Render will redeploy automatically

5. **Wait for Build**
   - Check the logs
   - Should see: `✔ Building...` and `Application bundle generation complete`

## Alternative: If Memory Issues

If you get memory errors, use:

```bash
NODE_OPTIONS=--max-old-space-size=1024 npm install && NODE_OPTIONS=--max-old-space-size=1024 npm run build:client
```

## Verify package.json Has build:client

Make sure your `package.json` has:
```json
"build:client": "ng build --configuration=client"
```

This should already be there, but verify it exists.

## Common Mistakes

❌ **Don't use:** `npm run build` (uses wrong config)
❌ **Don't use:** `npx ng build` (might not work in all environments)
✅ **Use:** `npm run build:client` (uses npm script, most reliable)

## Still Not Working?

1. Check the full error log in Render
2. Verify `package.json` has the `build:client` script
3. Try the simpler command first: `npm install && npm run build:client`
4. Check Node.js version (should be 18+)

