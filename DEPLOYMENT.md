# Deployment Guide

## Overview

- **Frontend**: Deployed on Vercel → https://khonkaenthaishop.vercel.app
- **Backend API**: Deployed on Render → https://khonkaenthaishop-api.onrender.com
- **Database**: Supabase PostgreSQL

---

## 🔵 Vercel (Frontend Deployment)

### Prerequisites
- Vercel account connected to your GitHub repository
- Repository pushed to GitHub

### Step 1: Configure Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your repository or select existing project `khonkaenthaishop`
3. **IMPORTANT**: Configure these settings in **Project Settings**:

#### Build & Development Settings
```
Root Directory: apps/frontend
Framework Preset: Next.js
Build Command: cd ../.. && npm run build:frontend
Output Directory: .next
Install Command: cd ../.. && npm install
Node Version: 20.x
```

#### Environment Variables
Add these in **Settings → Environment Variables**:

```bash
# Production & Preview & Development
NEXT_PUBLIC_API_URL=https://khonkaenthaishop-api.onrender.com/api
```

### Step 2: Deploy

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for build to complete
4. Verify at: https://khonkaenthaishop.vercel.app

### Troubleshooting Vercel

**Issue: 404 on all pages**
- Check that Root Directory is set to `apps/frontend`
- Verify Build Command includes `cd ../..`

**Issue: Build fails**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Test build locally: `npm run build:frontend`

---

## 🟢 Render (Backend Deployment)

### Prerequisites
- Render account
- Repository pushed to GitHub
- Supabase database credentials ready

### Option A: Deploy with Blueprint (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **Blueprints** → **New Blueprint Instance**
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Fill in the required environment variables:
   - `DATABASE_URL`: Your Supabase connection string (Transaction mode/Pooler)
   - `DIRECT_URL`: Your Supabase direct connection string

### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your repository
4. Configure the service:

```
Name: khonkaenthaishop-api
Region: Singapore
Branch: main
Root Directory: apps/backend
Runtime: Node
Build Command: cd ../.. && npm install && npm run db:generate && npm run build:backend
Start Command: cd ../.. && npm run start:prod --workspace=backend
```

#### Environment Variables

Add these in the Render dashboard:

```bash
NODE_ENV=production
PORT=10000

# Supabase Database (REQUIRED - Get from Supabase Dashboard)
# ⚠️ IMPORTANT: Use Transaction Pooler (IPv4 compatible) for DATABASE_URL on Render
DATABASE_URL=postgresql://postgres.tnsuurwxjxpraldilqwt:[YOUR-PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.tnsuurwxjxpraldilqwt.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://khonkaenthaishop.vercel.app
```

**To get DATABASE_URL from Supabase:**
1. Go to Supabase Dashboard → Project Settings → Database
2. Scroll to "Connection Pooling" section
3. **Select "Transaction" mode** (NOT Session mode)
4. Copy the connection string - should look like:
   ```
   postgresql://postgres.tnsuurwxjxpraldilqwt:[YOUR-PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
   ```
5. **Important**: Transaction Pooler is IPv4 compatible and works with Render's free tier
6. Direct Connection (port 5432) only supports IPv6 and requires paid tier on Render

#### Health Check
```
Health Check Path: /api
```

### Step 3: Deploy

1. Click **Create Web Service**
2. Wait for initial build (5-10 minutes)
3. Verify at: https://khonkaenthaishop-api.onrender.com/api

### Troubleshooting Render

**Issue: "nest: not found" during build**
- **Cause**: @nestjs/cli is missing from dependencies
- **Solution**: Ensure @nestjs/cli is in `dependencies` (NOT devDependencies) in `apps/backend/package.json`
- **Why**: Production builds on Render don't install devDependencies

**Issue: TypeScript errors about Prisma types during build**
- **Cause**: Build command is running `build:backend` before `db:generate`
- **Solution**: Build command must be: `npm run db:generate && npm run build:backend`
- **Why**: Prisma Client must be generated before TypeScript compilation

**Issue: "Can't reach database server" or P1001 error**
- **Cause**: Using wrong connection string format or IPv6-only connection
- **Solution**:
  - Use **Transaction Pooler** connection string (IPv4 compatible)
  - Format: `postgresql://postgres.PROJECT_ID:PASSWORD@aws-*.pooler.supabase.com:6543/postgres`
  - NOT: `postgresql://postgres:PASSWORD@db.*.supabase.co:5432/postgres` (IPv6 only)
- **Why**: Render free tier only supports IPv4, Direct Connection requires IPv6

**Issue: Authentication failed (P1000)**
- **Cause**: Incorrect password in connection string
- **Solution**:
  - Reset password in Supabase Dashboard → Database Settings
  - Update both DATABASE_URL and DIRECT_URL in Render with new password
  - Redeploy

**Issue: Build fails on Prisma**
- Ensure `DATABASE_URL` is set correctly
- Check that build command includes `npm run db:generate`

**Issue: App crashes on startup**
- Check logs in Render dashboard
- Verify all environment variables are set
- Test Supabase connection string

**Issue: Health check fails**
- Ensure `/api` endpoint returns 200 status
- Check that PORT is set to 10000
- Verify CORS settings allow Vercel domain

---

## 🗄️ Database Setup (Supabase)

### Get Connection Strings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **"Connection Pooling"** section
5. **Select "Transaction" mode** (this is IPv4 compatible)
6. Copy the connection string for `DATABASE_URL`:
   ```
   postgresql://postgres.PROJECT_ID:[PASSWORD]@aws-*.pooler.supabase.com:6543/postgres
   ```
7. Scroll to **"Connection string"** section (Direct connection)
8. Copy the connection string for `DIRECT_URL`:
   ```
   postgresql://postgres:[PASSWORD]@db.PROJECT_ID.supabase.co:5432/postgres
   ```

**Important Notes:**
- ✅ Use **Transaction Pooler** (port 6543) for `DATABASE_URL` - works on Render free tier
- ⚠️ **Direct Connection** (port 5432) only supports IPv6 - use only for `DIRECT_URL`
- 🔑 Replace `[PASSWORD]` with your actual database password

### Run Migrations

```bash
# After deploying backend to Render
npm run db:migrate
```

---

## 📝 Deployment Checklist

### Before First Deploy

- [ ] Push all code to GitHub
- [ ] Create Supabase project and database
- [ ] Get Supabase connection strings
- [ ] Test builds locally:
  ```bash
  npm run build:frontend
  npm run build:backend
  ```

### Vercel Setup

- [ ] Import project to Vercel
- [ ] Set Root Directory to `apps/frontend`
- [ ] Configure build commands
- [ ] Add `NEXT_PUBLIC_API_URL` environment variable
- [ ] Deploy and verify

### Render Setup

- [ ] Create Web Service
- [ ] Configure root directory and commands
- [ ] Add all environment variables (especially DATABASE_URL)
- [ ] Set health check path to `/api`
- [ ] Deploy and verify

### Post-Deployment

- [ ] Test frontend: https://khonkaenthaishop.vercel.app
- [ ] Test backend API: https://khonkaenthaishop-api.onrender.com/api
- [ ] Verify API calls from frontend work
- [ ] Check CORS is configured correctly
- [ ] Test user and post creation

---

## 🔄 Continuous Deployment

Both Vercel and Render are configured for automatic deployments:

- **Push to main branch** → Automatically deploys to production
- **Pull request** → Vercel creates preview deployment
- Check deployment status in respective dashboards

---

## 🆘 Common Issues

### Frontend can't connect to Backend

**Symptoms**: API calls fail, CORS errors in browser console

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
2. Check `FRONTEND_URL` is set correctly in Render
3. Ensure Render service is running (not sleeping)

### Backend fails to start

**Symptoms**: Health check fails, 502/503 errors

**Solutions**:
1. Check Render logs for errors
2. Verify DATABASE_URL format is correct
3. Ensure all environment variables are set
4. Check Prisma Client is generated during build

### Database connection fails

**Symptoms**: "Can't reach database server" errors, P1001 or P1000 errors

**Solutions**:
1. **Use Transaction Pooler for DATABASE_URL**:
   - Format: `postgresql://postgres.PROJECT_ID:PASSWORD@aws-*.pooler.supabase.com:6543/postgres`
   - This is IPv4 compatible and works on Render free tier
2. **DO NOT use Direct Connection for DATABASE_URL on Render**:
   - Direct Connection (port 5432) only supports IPv6
   - Only use Direct Connection for `DIRECT_URL` (for migrations)
3. Verify Supabase project is active
4. Check password is correct - reset in Supabase Dashboard if needed
5. Ensure connection string format matches exactly (including `postgres.PROJECT_ID` for pooler)

---

## 📊 Monitoring

### Vercel
- View deployments: https://vercel.com/dashboard
- Check analytics and logs in project dashboard

### Render
- View logs: Render Dashboard → Your Service → Logs
- Monitor health: Check health check status
- **Note**: Free tier services sleep after inactivity (first request may be slow)

### Supabase
- Monitor database: Supabase Dashboard → Database → Reports
- View logs: Supabase Dashboard → Logs

---

## 🔐 Security Notes

- Never commit `.env` files
- Use strong JWT_SECRET in production
- Rotate database passwords regularly
- Review CORS settings
- Enable rate limiting in production

---

## 📖 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
