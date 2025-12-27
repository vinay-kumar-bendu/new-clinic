# ✅ Complete Build Command - Final Solution

## The Problem

Even with `--legacy-peer-deps`, the `@angular-devkit/build-angular` package might not be found during build.

## Solution: Explicit Install + Verify

Use this **EXACT** command in Render's Build Command:

```bash
npm install --legacy-peer-deps && npm install @angular-devkit/build-angular@19.2.13 --save-dev --legacy-peer-deps && npx -y @angular/cli@19 build --configuration=client
```

## Why This Works

1. `npm install --legacy-peer-deps` - Installs all dependencies
2. `npm install @angular-devkit/build-angular@19.2.13 --save-dev --legacy-peer-deps` - Explicitly installs the build package
3. `npx -y @angular/cli@19 build --configuration=client` - Runs the build

## Step-by-Step

1. **Go to Render Dashboard**
   - Your Service → Settings

2. **Build Command Field**
   - **DELETE** everything
   - **PASTE** this exact command:
     ```bash
     npm install --legacy-peer-deps && npm install @angular-devkit/build-angular@19.2.13 --save-dev --legacy-peer-deps && npx -y @angular/cli@19 build --configuration=client
     ```
   - **SAVE**

3. **Wait for Build**
   - Should see packages installing
   - Then build should proceed

## Alternative: Simpler Version

If the above is too long, try:

```bash
npm install --legacy-peer-deps && npm run build:client
```

But make sure your `package.json` has `build:client` script (it should).

## With Memory Limit

If you need memory limit:

```bash
NODE_OPTIONS=--max-old-space-size=1024 npm install --legacy-peer-deps && NODE_OPTIONS=--max-old-space-size=1024 npm install @angular-devkit/build-angular@19.2.13 --save-dev --legacy-peer-deps && NODE_OPTIONS=--max-old-space-size=1024 npx -y @angular/cli@19 build --configuration=client
```

## Verify Installation in Logs

After build starts, check logs for:
```
added @angular-devkit/build-angular@19.2.13
✔ Building...
Application bundle generation complete.
```

If you see `@angular-devkit/build-angular` being installed, it should work.

## Still Not Working?

If you still get the error, the package might be in the wrong location. Try this diagnostic command first:

```bash
npm install --legacy-peer-deps && ls -la node_modules/@angular-devkit/build-angular && npx -y @angular/cli@19 build --configuration=client
```

This will show if the package exists before building.

