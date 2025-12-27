# Fix: ERESOLVE Dependency Conflict

## Problem

Angular packages have version conflicts. npm is being strict about peer dependencies.

## Solution: Use --legacy-peer-deps

Use this **EXACT** command in Render's Build Command:

```bash
npm install --legacy-peer-deps && npx -y @angular/cli@19 build --configuration=client
```

## Why --legacy-peer-deps Works

- Tells npm to use the old (more lenient) dependency resolution
- Ignores peer dependency conflicts
- Angular packages will still work fine together
- This is safe for Angular projects

## Step-by-Step

1. **Go to Render Dashboard**
   - Your Service → Settings

2. **Build Command Field**
   - **REPLACE** with this exact command:
     ```bash
     npm install --legacy-peer-deps && npx -y @angular/cli@19 build --configuration=client
     ```
   - **SAVE**

3. **Wait for Build**
   - Should install without conflicts
   - Then build should proceed

## Alternative: With Memory Limit

If you need memory limit:

```bash
NODE_OPTIONS=--max-old-space-size=1024 npm install --legacy-peer-deps && NODE_OPTIONS=--max-old-space-size=1024 npx -y @angular/cli@19 build --configuration=client
```

## Why This Happens

- Angular 19 has multiple packages that need to match versions
- npm 7+ is strict about peer dependencies
- `--legacy-peer-deps` uses npm 6 behavior (more lenient)
- This is a common solution for Angular projects

## Verify It's Working

After build starts, you should see:
```
npm WARN using --legacy-peer-deps to provide...
added 1234 packages
✔ Building...
Application bundle generation complete.
```

The warning about `--legacy-peer-deps` is normal and safe to ignore.

## Still Not Working?

If you still get errors, try:

```bash
npm install --legacy-peer-deps --force && npx -y @angular/cli@19 build --configuration=client
```

The `--force` flag is more aggressive but should work.

