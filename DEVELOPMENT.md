# Development Workflow

คู่มือสำหรับการพัฒนาและรันโปรเจ็ค Khon Kaen Thai Shop

---

## 📋 Table of Contents

1. [ติดตั้งโปรเจ็คครั้งแรก](#ติดตั้งโปรเจ็คครั้งแรก)
2. [รันโปรเจ็คในเครื่อง (Local Development)](#รันโปรเจ็คในเครื่อง-local-development)
3. [เมื่ออัปเดตโค้ดใหม่](#เมื่ออัปเดตโค้ดใหม่)
4. [Deploy ไปยัง Production](#deploy-ไปยัง-production)
5. [Troubleshooting](#troubleshooting)

---

## ติดตั้งโปรเจ็คครั้งแรก

### Prerequisites
- Node.js v20.x หรือสูงกว่า
- npm v8.x หรือสูงกว่า
- Git

### ขั้นตอน

```bash
# 1. Clone repository
git clone https://github.com/anchalitaka/khonkaenthaishop.git
cd khonkaenthaishop

# 2. ติดตั้ง dependencies ทั้งหมด
npm install

# 3. Setup environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. แก้ไขไฟล์ .env ให้ตรงกับสภาพแวดล้อมของคุณ
# - Backend: apps/backend/.env
# - Frontend: apps/frontend/.env

# 5. Generate Prisma Client
npm run db:generate

# 6. Push database schema to Supabase
npm run db:push
```

---

## รันโปรเจ็คในเครื่อง (Local Development)

### วิธีที่ 1: รันทั้ง Frontend และ Backend พร้อมกัน

```bash
npm run dev
```

จะเปิด:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### วิธีที่ 2: รันแยกกัน

**รัน Backend เท่านั้น:**
```bash
npm run dev:backend
```
- API จะทำงานที่ http://localhost:3001
- API docs: http://localhost:3001/api

**รัน Frontend เท่านั้น:**
```bash
npm run dev:frontend
```
- Frontend จะทำงานที่ http://localhost:3000

---

## เมื่ออัปเดตโค้ดใหม่

### 1. Pull โค้ดล่าสุดจาก GitHub

```bash
# Pull โค้ดล่าสุด
git pull origin main
```

### 2. ติดตั้ง Dependencies ใหม่ (ถ้ามี)

```bash
# ติดตั้ง dependencies ที่เพิ่มใหม่
npm install
```

**เมื่อไหร่ต้องรัน `npm install`:**
- ✅ เมื่อ `package.json` หรือ `package-lock.json` มีการเปลี่ยนแปลง
- ✅ หลังจาก pull โค้ดครั้งแรกในวันใหม่
- ✅ เมื่อมี error เกี่ยวกับ dependencies
- ❌ ไม่จำเป็นถ้าแค่แก้โค้ดในไฟล์ `.ts`, `.tsx` ทั่วไป

### 3. อัปเดต Database Schema (ถ้ามี)

```bash
# ถ้ามีการเปลี่ยนแปลง Prisma schema
npm run db:generate
npm run db:push
```

**เมื่อไหร่ต้องรัน:**
- ✅ เมื่อ `apps/backend/prisma/schema.prisma` มีการเปลี่ยนแปลง
- ✅ เมื่อมี error `PrismaClient` หรือ types ไม่ตรง
- ❌ ไม่จำเป็นถ้าไม่มีการแก้ database schema

### 4. รันโปรเจ็ค

```bash
# รันทั้งหมด
npm run dev

# หรือรันแยก
npm run dev:backend
npm run dev:frontend
```

---

## เมื่อคุณเขียนโค้ดใหม่

### Workflow การพัฒนา

```bash
# 1. สร้าง branch ใหม่ (ถ้าทำงานเป็นทีม)
git checkout -b feature/your-feature-name

# 2. เขียนโค้ด และทดสอบในเครื่อง
npm run dev

# 3. เช็คว่าโค้ดถูกต้อง
npm run build              # Build ทั้งหมด
npm run build:frontend     # Build Frontend เท่านั้น
npm run build:backend      # Build Backend เท่านั้น

# 4. Commit และ Push
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name

# 5. สร้าง Pull Request บน GitHub (ถ้าทำงานเป็นทีม)
```

### ขั้นตอนแบบรวดเร็ว (Quick Workflow)

```bash
# 1. เขียนโค้ด
# 2. บันทึก (Ctrl+S / Cmd+S)
# 3. โปรแกรมจะ reload อัตโนมัติ (Hot Reload)
# 4. ทดสอบในเบราว์เซอร์
# 5. Commit และ Push

git add .
git commit -m "Your commit message"
git push
```

---

## Deploy ไปยัง Production

### Auto Deployment (แนะนำ)

โปรเจ็คนี้ตั้งค่า Auto Deployment แล้ว:

```bash
# แค่ push ไป main branch
git push origin main
```

**จะเกิดอะไรขึ้นอัตโนมัติ:**
- ✅ **Vercel** จะ deploy Frontend ใหม่โดยอัตโนมัติ
- ✅ **Render** จะ deploy Backend ใหม่โดยอัตโนมัติ (ถ้าเปิด Auto-Deploy)

### Manual Deployment

**Render (Backend):**
1. ไปที่ https://dashboard.render.com/
2. เลือก service `khonkaenthaishop-api`
3. คลิก **Manual Deploy** → **Deploy latest commit**

**Vercel (Frontend):**
1. ไปที่ https://vercel.com/dashboard
2. เลือก project `khonkaenthaishop`
3. คลิก **Redeploy**

---

## Troubleshooting

### ปัญหาที่พบบ่อย

#### 1. `npm install` ล้มเหลว

```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

#### 2. Frontend ไม่เชื่อมต่อ Backend

ตรวจสอบ `apps/frontend/.env`:
```bash
# Local Development
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Production (ต้องแก้ใน Vercel Dashboard)
NEXT_PUBLIC_API_URL=https://khonkaenthaishop-api.onrender.com/api
```

#### 3. Database connection error

```bash
# ตรวจสอบว่า DATABASE_URL ถูกต้อง
# อยู่ในไฟล์ apps/backend/.env

# Generate Prisma Client ใหม่
npm run db:generate

# Push schema ใหม่
npm run db:push
```

#### 4. Port already in use

```bash
# หา process ที่ใช้ port
lsof -i :3001  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>

# หรือเปลี่ยน port ใน .env
PORT=3002
```

#### 5. TypeScript errors หลัง pull โค้ดใหม่

```bash
# Rebuild TypeScript
npm run build

# ถ้ายัง error ให้ลบ dist และ .next
rm -rf apps/backend/dist
rm -rf apps/frontend/.next
npm run build
```

---

## คำสั่งที่ใช้บ่อย

```bash
# Development
npm run dev                 # รันทั้ง Frontend + Backend
npm run dev:frontend        # รัน Frontend เท่านั้น
npm run dev:backend         # รัน Backend เท่านั้น

# Build
npm run build               # Build ทั้งหมด
npm run build:frontend      # Build Frontend
npm run build:backend       # Build Backend

# Database
npm run db:generate         # Generate Prisma Client
npm run db:push             # Push schema ไป database
npm run db:studio           # เปิด Prisma Studio (GUI)
npm run db:migrate          # Run migrations (development)

# Testing
npm run test               # Run tests
```

---

## สรุป Quick Reference

### 📍 เมื่อ Pull โค้ดใหม่

```bash
git pull origin main
npm install                 # ถ้า dependencies เปลี่ยน
npm run db:generate         # ถ้า schema เปลี่ยน
npm run db:push            # ถ้า schema เปลี่ยน
npm run dev
```

### 📍 เมื่อเขียนโค้ดใหม่

```bash
# เขียนโค้ด → บันทึก → ทดสอบ → Commit
git add .
git commit -m "Your message"
git push
```

### 📍 เมื่อ Deploy

```bash
git push origin main
# รอ Auto Deploy จาก Vercel & Render
```

---

## 🔗 Links

- **Frontend (Production)**: https://khonkaenthaishop.vercel.app
- **Backend API (Production)**: https://khonkaenthaishop-api.onrender.com/api
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com/
- **Supabase Dashboard**: https://supabase.com/dashboard

---

## 📞 Need Help?

ถ้ามีปัญหาหรือข้อสงสัย:
1. ดู [DEPLOYMENT.md](./DEPLOYMENT.md) สำหรับการ deploy
2. ดู error logs ใน terminal
3. ตรวจสอบ environment variables ใน `.env`
