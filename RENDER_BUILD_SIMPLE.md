# Simple Build Command for Render

## Use This EXACT Build Command

Copy and paste this **EXACT** command into Render's Build Command field:

```bash
npm ci && npm run build:client
```

**OR** if you get memory errors:

```bash
NODE_OPTIONS=--max-old-space-size=1024 npm ci && NODE_OPTIONS=--max-old-space-size=1024 npm run build:client
```

## Why `npm ci` Instead of `npm install`?

- `npm ci` is faster and more reliable for CI/CD
- It does a clean install based on `package-lock.json`
- Better for production builds
- More predictable

## Step-by-Step

1. **Go to Render Dashboard**
   - Your Service → Settings

2. **Build Command Field**
   - Clear everything
   - Paste: `npm ci && npm run build:client`
   - Save

3. **Wait for Build**
   - Check logs
   - Should see successful build

## If Still Failing

Try this even simpler version:

```bash
npm install && ./node_modules/.bin/ng build --configuration=client
```

This directly calls the Angular CLI from node_modules.

## Alternative: Two-Step Build

If single command fails, try separating:

**Step 1 - Install:**
```bash
npm ci
```

**Step 2 - Build:**
```bash
npm run build:client
```

But Render usually needs a single command, so use the `&&` version above.

