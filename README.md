# FullStack Web Application

แอปพลิเคชัน Full-Stack ที่สร้างด้วย **Next.js** + **NestJS** + **Prisma** + **Supabase PostgreSQL**

## 📁 โครงสร้างโปรเจค

```
fullstack-app/
├── apps/
│   ├── frontend/          # Next.js 15 (App Router)
│   │   ├── src/
│   │   │   ├── app/       # Pages & Routes
│   │   │   ├── components/# UI Components
│   │   │   ├── lib/       # API Client & Hooks
│   │   │   └── types/     # TypeScript Types
│   │   └── ...
│   │
│   └── backend/           # NestJS API
│       ├── src/
│       │   ├── prisma/    # Prisma Service
│       │   ├── users/     # Users Module
│       │   └── posts/     # Posts Module
│       └── prisma/
│           └── schema.prisma
│
└── packages/              # Shared packages (future)
```

## 🚀 เริ่มต้นใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

**⚠️ หากเจอ permission error (EACCES)**

```bash
# แก้ไข npm global prefix
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# ลองติดตั้งใหม่
npm install
```

### 2. ตั้งค่า Supabase Database

#### 2.1 สร้างโปรเจค Supabase

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. คลิก **New Project**
3. ตั้งชื่อโปรเจคและสร้าง Password (เก็บไว้ใช้ในขั้นตอนถัดไป)

#### 2.2 ดึง Connection Details

1. ไปที่ **Project Settings** (⚙️) → **Database**
2. เลื่อนลงหา **Connection string** หรือ **Connection parameters**
3. คุณจะเห็นข้อมูลแบบนี้:

```
Host: db.[PROJECT_ID].supabase.co
Port: 5432 (Direct), 6543 (Pooler)
Database: postgres
User: postgres
Password: [YOUR_PASSWORD]
```

#### 2.3 สร้างไฟล์ `.env`

แก้ไขไฟล์ `apps/backend/.env` (หรือ copy จาก `.env.example`):

```bash
# apps/backend/.env

# Connection Pooler (Transaction mode) - ใช้สำหรับ Prisma Client (IPv4 Compatible)
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Direct Connection - ใช้สำหรับ Prisma Migrate
DIRECT_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# Application Settings
PORT=3001
NODE_ENV=development

# JWT Secret (สร้างด้วย: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-this

# JWT Expiration
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**ตัวอย่างจริง:**

```bash
# Transaction Pooler (IPv4 compatible - สำหรับ Render/Vercel)
DATABASE_URL="postgresql://postgres.tnsuurwxjxpraldilqwt:mypassword123@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"

# Direct Connection (สำหรับ local development และ migrations)
DIRECT_URL="postgresql://postgres:mypassword123@db.tnsuurwxjxpraldilqwt.supabase.co:5432/postgres"
```

**📍 สำคัญ:**
- ใช้ **Transaction Pooler** (`aws-*.pooler.supabase.com:6543`) สำหรับ production เพราะรองรับ IPv4
- User format: `postgres.[PROJECT_ID]` สำหรับ Pooler
- Direct connection ใช้ `postgres` (ไม่มี project ID)

### 3. สร้าง Database Schema

```bash
cd apps/backend

# แก้ไข Prisma cache permissions (ถ้าเจอ permission error)
chmod -R u+w ~/.cache/prisma
rm -rf ~/.cache/prisma
rm -rf node_modules/.prisma

# Generate Prisma Client
npx prisma generate

# Push schema ไปยัง Supabase
npx prisma db push

# (Optional) เปิด Prisma Studio เพื่อดูข้อมูล
npx prisma studio
```

**✅ หากสำเร็จจะเห็น:**

```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

### 4. รัน Development Server

```bash
# กลับไปที่ root folder
cd ../..

# รัน frontend + backend พร้อมกัน
npm run dev
```

**หรือรันแยกใน 2 terminals:**

```bash
# Terminal 1: Backend
npm run dev:backend   # Backend: http://localhost:3001/api

# Terminal 2: Frontend
npm run dev:frontend  # Frontend: http://localhost:3000
```

**✅ หากสำเร็จจะเห็น:**

```
🚀 Backend is running on: http://localhost:3001/api
▲ Next.js - Local: http://localhost:3000
```

### 5. ทดสอบการทำงาน

เปิดเบราว์เซอร์ไปที่:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001/api](http://localhost:3001/api)

**ทดสอบ API ด้วย curl:**

```bash
# ดึงรายชื่อผู้ใช้
curl http://localhost:3001/api/users

# สร้างผู้ใช้ใหม่
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# ดึงรายการโพสต์
curl http://localhost:3001/api/posts
```

## 📚 API Endpoints

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| GET    | `/api/users`               | ดึงรายชื่อผู้ใช้ทั้งหมด |
| POST   | `/api/users`               | สร้างผู้ใช้ใหม่         |
| GET    | `/api/users/:id`           | ดึงข้อมูลผู้ใช้ตาม ID   |
| PATCH  | `/api/users/:id`           | อัพเดทข้อมูลผู้ใช้      |
| DELETE | `/api/users/:id`           | ลบผู้ใช้                |
| GET    | `/api/posts`               | ดึงโพสต์ทั้งหมด         |
| POST   | `/api/posts`               | สร้างโพสต์ใหม่          |
| GET    | `/api/posts/:id`           | ดึงข้อมูลโพสต์ตาม ID    |
| PATCH  | `/api/posts/:id`           | อัพเดทโพสต์             |
| PATCH  | `/api/posts/:id/publish`   | เผยแพร่โพสต์            |
| PATCH  | `/api/posts/:id/unpublish` | ซ่อนโพสต์               |
| DELETE | `/api/posts/:id`           | ลบโพสต์                 |

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  posts     Post[]
  comments  Comment[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(...)
  comments  Comment[]
}
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, SWR
- **Backend**: NestJS, Prisma ORM
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript

## 📝 Scripts

```bash
# Development
npm run dev              # รัน frontend + backend พร้อมกัน
npm run dev:frontend     # รัน frontend เท่านั้น
npm run dev:backend      # รัน backend เท่านั้น

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio

# Build
npm run build            # Build ทั้ง frontend และ backend
```

## 🔒 Environment Variables

### Backend (.env)

```bash
DATABASE_URL=           # Supabase Connection Pooler URL
DIRECT_URL=            # Supabase Direct Connection URL
PORT=3001              # Backend port
JWT_SECRET=            # JWT secret key
FRONTEND_URL=          # Frontend URL for CORS
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🐛 Troubleshooting

### ปัญหา 1: npm permission error (EACCES)

**อาการ:** `Error: EACCES: permission denied`

**วิธีแก้:**

```bash
# แก้ไข npm global prefix
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# หรือใช้ sudo (ไม่แนะนำ)
sudo chown -R $(whoami) ~/.npm-global
```

### ปัญหา 2: Prisma permission error

**อาการ:** `Error: EACCES: permission denied, unlink` ใน Prisma cache

**วิธีแก้:**

```bash
# แก้ไข permissions
sudo chown -R $(whoami) ~/.cache/prisma
chmod -R u+w ~/.cache/prisma

# หรือลบและสร้างใหม่
rm -rf ~/.cache/prisma
rm -rf apps/backend/node_modules/.prisma
cd apps/backend && npx prisma generate
```

### ปัญหา 3: Supabase connection error

**อาการ:** `Error: Tenant or user not found`, `FATAL: password authentication failed`, หรือ `Can't reach database server`

**วิธีแก้:**

1. **สำหรับ Local Development** - ใช้ Direct Connection:
```bash
# ✅ ถูกต้อง (Local)
DATABASE_URL="postgresql://postgres:mypassword@db.abc123.supabase.co:5432/postgres"
```

2. **สำหรับ Production (Render/Vercel)** - ใช้ Transaction Pooler:
```bash
# ✅ ถูกต้อง (Production - IPv4 compatible)
DATABASE_URL="postgresql://postgres.abc123:mypassword@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"
```

3. **หา Connection String ที่ถูกต้อง:**
   - Supabase Dashboard → Settings → Database → Connection String
   - คลิก dropdown **"Connection String"** เลือก **"Transaction pooler"**
   - คัดลอก connection string ที่แสดง

4. **ตรวจสอบ password:**
   - Password ต้องตรงกับที่ตั้งไว้ตอนสร้าง project
   - ถ้าลืม password ให้ reset: Supabase Dashboard → Settings → Database → Reset Database Password

5. **IPv4 vs IPv6:**
   - Direct Connection (port 5432) รองรับเฉพาะ IPv6 (ต้องซื้อ add-on $4 สำหรับ IPv4)
   - Transaction Pooler (port 6543) รองรับ IPv4 ฟรี ✅
   - Render/Vercel ใช้ IPv4 ดังนั้นต้องใช้ Transaction Pooler

### ปัญหา 4: Prisma version 7 error

**อาการ:** `Error: The datasource property 'url' is no longer supported`

**วิธีแก้:**

โปรเจคนี้ใช้ Prisma v6 (ไม่ใช้ v7)

```bash
# ตรวจสอบ version ใน package.json
"prisma": "^6.9.0"
"@prisma/client": "^6.9.0"

# ถ้าติดตั้ง v7 ไปแล้ว ให้ downgrade
cd apps/backend
npm install prisma@6.19.1 @prisma/client@6.19.1
npx prisma generate
```

### ปัญหา 5: Port already in use

**อาการ:** `Error: listen EADDRINUSE: address already in use :::3000`

**วิธีแก้:**

```bash
# หา process ที่ใช้ port
lsof -i :3000
lsof -i :3001

# ปิด process
kill -9 [PID]

# หรือเปลี่ยน port ในไฟล์ .env
PORT=3002  # สำหรับ backend
```

### ปัญหา 6: node_modules ลบไม่ได้

**อาการ:** `rm: node_modules: Permission denied`

**วิธีแก้:**

```bash
# แก้ไข ownership
sudo chown -R $(whoami) node_modules
rm -rf node_modules

# หรือใช้ chmod
chmod -R u+w node_modules
rm -rf node_modules
```

## 🚢 Deploy to Production (ฟรี!)

### ขั้นตอนที่ 1: เตรียม GitHub Repository

1. สร้าง repository ใหม่บน GitHub
2. Push code ขึ้น GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### ขั้นตอนที่ 2: Deploy Frontend บน Vercel

1. ไปที่ [Vercel](https://vercel.com) และ Sign up ด้วย GitHub
2. คลิก **"Add New Project"**
3. Import repository ของคุณ
4. ตั้งค่า:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

5. เพิ่ม Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

6. คลิก **"Deploy"**

**✅ Frontend URL:** `https://your-app.vercel.app`

### ขั้นตอนที่ 3: Deploy Backend บน Render

1. ไปที่ [Render](https://render.com) และ Sign up ด้วย GitHub
2. คลิก **"New +" → "Web Service"**
3. เชื่อม GitHub repository
4. ตั้งค่า:
   - **Name:** `your-backend`
   - **Region:** Singapore (หรือใกล้คุณที่สุด)
   - **Branch:** `main`
   - **Root Directory:** `apps/backend`
   - **Runtime:** Node
   - **Build Command:** `./render-build.sh`
   - **Start Command:** `npm run start:prod`

5. เพิ่ม Environment Variables:

```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
PORT=3001
NODE_ENV=production
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE
FRONTEND_URL=https://your-app.vercel.app
```

6. คลิก **"Create Web Service"**

**✅ Backend URL:** `https://your-backend.onrender.com`

### ขั้นตอนที่ 4: อัพเดท Frontend URL

กลับไปที่ **Vercel** → Project Settings → Environment Variables

อัพเดท `NEXT_PUBLIC_API_URL`:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

Redeploy ด้วยการคลิก **"Redeploy"**

### ขั้นตอนที่ 5: ทดสอบ Production

เปิดเบราว์เซอร์ไปที่:
- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-backend.onrender.com/api`

**ทดสอบ API:**

```bash
curl https://your-backend.onrender.com/api/users
```

### 🎉 เสร็จแล้ว!

แอปของคุณถูก deploy แล้วและพร้อมใช้งาน!

**สิ่งที่ได้:**
- ✅ Frontend บน Vercel (ฟรีตลอดไป)
- ✅ Backend บน Render (ฟรี แต่จะหลับเมื่อไม่ใช้งาน 15 นาที)
- ✅ Database บน Supabase (ฟรี 500MB)
- ✅ SSL/HTTPS ฟรีทุกอย่าง
- ✅ Auto-deploy เมื่อ push code

**ข้อจำกัดของ Free Plan:**
- Render: Backend จะหลับหลังไม่ใช้งาน 15 นาที (ใช้งานครั้งแรกต้องรอ 30-60 วินาที)
- Supabase: 500MB database, 2GB bandwidth/month
- Vercel: 100GB bandwidth/month

**อัพเกรดเป็น Production จริง:**
- Render: $7/เดือน (ไม่หลับ + เร็วขึ้น)
- Railway: $5 credit/เดือน (ไม่หลับ)

---

## 📖 เอกสารเพิ่มเติม

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)

## 🤝 Contributing

หากพบปัญหาหรือต้องการเพิ่มฟีเจอร์ใหม่ สามารถ:

1. Fork repository นี้
2. สร้าง branch ใหม่ (`git checkout -b feature/amazing-feature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add amazing feature'`)
4. Push ไปยัง branch (`git push origin feature/amazing-feature`)
5. เปิด Pull Request

---

สร้างด้วย ❤️ โดย Claude
