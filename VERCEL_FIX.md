# Vercel Deployment - Configuration Fix

## 🔴 Current Issue
The login is failing with a 405 error because the API URL is incorrect on Vercel.

## ✅ Fix Steps

### Step 1: Remove Incorrect Environment Variables from Vercel

1. Go to **https://vercel.com**
2. Select your **Dalali** project
3. Go to **Settings → Environment Variables**
4. **DELETE these variables if they exist:**
   - ❌ `VITE_API_URL`
   - ❌ `VITE_API_BASE_URL`
   - ❌ Any other VITE_* variables that aren't needed

### Step 2: Set Correct Backend Environment Variables

Keep ONLY these variables set in Vercel:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_7yoc8UmuaxjV@ep-late-resonance-anv0u9yc-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=Yh/ETXhAMzF0Edhg+jcnvW1AeURV54Abhr+usXEbEAGcuFH+RF1dShZVk5f5aMlH+NU7FdfJqIWoCQH579XPpg==
JWT_EXPIRE=7d
CLIENT_URL=https://your-vercel-domain.vercel.app
```

### Step 3: Redeploy

1. After updating environment variables, go to **Deployments**
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**
4. Wait 3-5 minutes for deployment to complete

### Step 4: Clear Browser Cache

1. Open your deployed site: `https://your-vercel-domain.vercel.app`
2. Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
3. Clear cached files from your site
4. Close browser tab and reopen

### Step 5: Test

Try logging in again:
- **Email:** admin@dalali.com
- **Password:** Admin@2024!

## 🔍 How to Verify It's Working

### Check 1: API Health Endpoint
Open this in your browser (replace with your actual domain):
```
https://your-vercel-domain.vercel.app/api/health
```

**Should return:** `{"status":"OK"}`

If you get a 404 or blank page, the backend isn't deployed.

### Check 2: Browser Console Logs
1. Open the login page
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Try to login
5. Look for logs like:
```
[API Config] Environment: production
[API Config] Hostname: your-domain.vercel.app
[API Config] Base URL: /api
[API Request] POST /api/auth/login
```

If the Base URL shows something like `/_/backend/api`, then the environment variable is still wrong.

## ⚠️ Common Mistakes

**❌ Don't set:**
- `VITE_API_URL=https://...` (will override runtime detection)
- `VITE_API_BASE_URL=/api` (not needed, detected at runtime)
- Any frontend environment variables on Vercel (they're built into the artifact)

**✅ Only set backend variables:**
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV`
- `CLIENT_URL`
- `JWT_EXPIRE`

## 🆘 If It Still Doesn't Work

1. **Check Vercel Build Logs:**
   - Go to Deployments → Latest → View Build Logs
   - Look for TypeScript errors or build failures

2. **Check Function Logs:**
   - Go to Deployments → Latest → View Function Logs
   - Look for errors when API is called

3. **Test from Local:**
   - Run `npm run dev` locally
   - Login should work on `http://localhost:5173`
   - If it works locally but not on Vercel, it's an environment variable issue

4. **Force Clear Vercel Cache:**
   - In Vercel Settings → Deployments
   - Click "..." on latest deployment
   - Select "Redeploy" (not from cache)

## 📝 Your Vercel Environment Variables Should Look Like This:

```
NODE_ENV                production
PORT                    5000
DATABASE_URL            postgresql://neondb_owner:npg_7yoc...
JWT_SECRET              Yh/ETXhAMzF0Edhg+jcnvW...
JWT_EXPIRE              7d
CLIENT_URL              https://your-project.vercel.app
```

**Nothing else. No VITE_* variables.**

---

The frontend will auto-detect the correct API URL based on whether it's running on localhost or production. Let me know once you've made these changes!
