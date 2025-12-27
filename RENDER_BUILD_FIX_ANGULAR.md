# Fix: Could not find '@angular-devkit/build-angular:application' builder

## Problem

The error means `@angular-devkit/build-angular` package is not installed. This is in `devDependencies` and needs to be installed.

## Solution: Install All Dependencies Including DevDependencies

Use this **EXACT** command in Render's Build Command:

```bash
npm install --include=dev && npx -y @angular/cli@19 build --configuration=client
```

**OR** (simpler, npm install should include dev by default):

```bash
npm install && npx -y @angular/cli@19 build --configuration=client
```

## Why This Happens

- `@angular-devkit/build-angular` is in `devDependencies`
- If Render uses `npm ci --production`, it skips devDependencies
- We need to ensure devDependencies are installed

## Step-by-Step Fix

1. **Go to Render Dashboard**
   - Your Service → Settings

2. **Build Command Field**
   - **REPLACE** with this exact command:
     ```bash
     npm install && npx -y @angular/cli@19 build --configuration=client
     ```
   - **SAVE**

3. **Verify Node.js Version**
   - In Render Settings, check Node.js version
   - Should be **18** or **20**
   - If not, set it explicitly

## Alternative: Explicit DevDependencies Install

If the above doesn't work, try:

```bash
npm install --include=dev && npm install @angular-devkit/build-angular --save-dev && npx -y @angular/cli@19 build --configuration=client
```

## Check package.json

Make sure your `package.json` has:

```json
"devDependencies": {
  "@angular-devkit/build-angular": "^19.2.13",
  "@angular/cli": "^19.2.13",
  ...
}
```

This should already be there, but verify it exists.

## Full Build Command with Memory Limit

If you need memory limit:

```bash
NODE_OPTIONS=--max-old-space-size=1024 npm install && NODE_OPTIONS=--max-old-space-size=1024 npx -y @angular/cli@19 build --configuration=client
```

## Verify Installation

After build starts, check logs for:
```
added @angular-devkit/build-angular@19.2.13
added @angular/cli@19.2.13
...
✔ Building...
```

If you see these packages being installed, it should work.

