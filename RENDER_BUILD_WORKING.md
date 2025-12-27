# ✅ Working Build Command for Render

## Use This Build Command

Go to **Render → Your Service → Settings → Build Command** and use:

```bash
bash build.sh
```

**OR** if that doesn't work, use this single line:

```bash
npm install && npm install @angular/cli --save-dev && npm run build:client
```

## Why This Works

1. **First `npm install`** - Installs all dependencies from package.json
2. **Second `npm install @angular/cli`** - Ensures Angular CLI is definitely installed
3. **`npm run build:client`** - Uses the npm script which finds ng via npx

## Alternative: Direct Command

If scripts don't work, try this:

```bash
npm install && npx -y @angular/cli build --configuration=client
```

The `-y` flag auto-confirms if Angular CLI needs to be installed.

## Step-by-Step

1. **Go to Render Dashboard**
   - Your Service → Settings

2. **Build Command Field**
   - Clear current command
   - Paste: `bash build.sh`
   - OR paste: `npm install && npm install @angular/cli --save-dev && npm run build:client`
   - Save

3. **Wait for Build**
   - Should see: "Installing dependencies..."
   - Then: "Building Angular application..."
   - Finally: "Application bundle generation complete"

## If Still Failing

Share the **exact error message** from Render logs, and I'll help debug further.

Common issues:
- Node.js version (should be 18+)
- Memory limits (use NODE_OPTIONS if needed)
- Missing package-lock.json (npm install should create it)

