# 📦 Techify - E-Commerce Platform
## نسخة نظيفة ومستقرة - Clean & Stable Version

---

## 📋 نظرة عامة | Overview

**Techify** هو متجر إلكتروني متكامل لبيع المنتجات التقنية (هواتف، لابتوبات، سماعات، إلخ).

### التقنيات المستخدمة | Tech Stack

#### Frontend (Next.js)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: React Context + Hooks
- **UI Components**: Custom components + Shadcn/ui
- **Deployment**: Vercel

#### Backend (Express.js)
- **Framework**: Express.js
- **Language**: JavaScript (Node.js)
- **Database ORM**: Prisma
- **Database**: PostgreSQL (Railway)
- **File Upload**: Cloudinary
- **Authentication**: JWT + bcrypt
- **Security**: Rate limiting, CORS, XSS protection
- **Logging**: Morgan + Custom logger
- **Deployment**: Railway

---

## 🗂️ هيكل المشروع | Project Structure

```
techify/
├── 📁 app/                          # Next.js App Router pages
│   ├── (auth)/                      # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (shop)/                      # Shop pages
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── products/
│   │   └── wishlist/
│   ├── admin/                       # Admin dashboard
│   │   ├── categories/
│   │   ├── orders/
│   │   └── products/
│   └── api/                         # API routes (NextAuth)
│
├── 📁 components/                   # React components
│   ├── AddToCartBtn.tsx
│   ├── ProductCard.tsx
│   ├── Navbar.tsx
│   └── ... (50+ components)
│
├── 📁 lib/                          # Utilities & configs
│   ├── api.ts                       # API client
│   ├── auth-options.ts              # NextAuth config
│   ├── config.ts                    # App config
│   └── utils.ts
│
├── 📁 server/                       # Backend Express server
│   ├── 📁 controllers/              # Business logic
│   │   ├── products.js              # Products CRUD + filtering
│   │   ├── category.js              # Categories management
│   │   ├── users.js                 # User authentication
│   │   ├── customer_orders.js       # Orders management
│   │   └── wishlist.js              # Wishlist operations
│   │
│   ├── 📁 routes/                   # API routes
│   │   ├── products.js
│   │   ├── category.js
│   │   ├── users.js
│   │   ├── customer_orders.js
│   │   └── wishlist.js
│   │
│   ├── 📁 middleware/               # Express middleware
│   │   ├── rateLimiter.js           # Rate limiting
│   │   ├── advancedRateLimiter.js   # Advanced rate limits
│   │   └── requestLogger.js         # Request logging
│   │
│   ├── 📁 utills/                   # Utilities
│   │   ├── db.js                    # Prisma client (SSL)
│   │   ├── errorHandler.js          # Error handling
│   │   └── validation.js            # Input validation
│   │
│   ├── 📁 config/
│   │   └── cloudinary.js            # Cloudinary config
│   │
│   ├── 📁 prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # Database migrations
│   │
│   ├── app.js                       # Express app entry
│   ├── package.json
│   ├── vercel.json                  # Vercel config
│   └── railway.json                 # Railway config
│
├── 📁 prisma/                       # Frontend Prisma (optional)
│   └── schema.prisma
│
├── 📁 public/                       # Static assets
│   ├── logo v1.png
│   └── ... (product images, icons)
│
├── .env                             # Frontend environment
├── .env.local                       # Local overrides
├── package.json
├── next.config.mjs
└── tailwind.config.ts
```

---

## 🗄️ قاعدة البيانات | Database Schema

### Models (Prisma Schema)

#### 1. **Product** - المنتجات
```prisma
model Product {
  id           String   @id @default(uuid())
  slug         String   @unique
  title        String
  mainImage    String
  price        Int
  rating       Int      @default(5)
  description  String?
  manufacturer String?
  inStock      Int      @default(0)
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])
  
  // Relations
  orderProducts customer_order_product[]
  wishlists     Wishlist[]
}
```

#### 2. **Category** - الفئات
```prisma
model Category {
  id       String    @id @default(uuid())
  name     String    @unique
  products Product[]
}
```

#### 3. **User** - المستخدمين
```prisma
model User {
  id            String           @id @default(uuid())
  email         String           @unique
  password      String
  firstName     String?
  lastName      String?
  role          String           @default("user")
  
  // Relations
  orders        customer_order[]
  wishlists     Wishlist[]
}
```

#### 4. **customer_order** - الطلبات
```prisma
model customer_order {
  id              String   @id @default(uuid())
  userId          String
  totalPrice      Int
  status          String   @default("pending")
  shippingAddress String?
  paymentMethod   String?
  createdAt       DateTime @default(now())
  
  user            User     @relation(fields: [userId], references: [id])
  orderProducts   customer_order_product[]
}
```

#### 5. **customer_order_product** - عناصر الطلب
```prisma
model customer_order_product {
  id        String         @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Int
  
  order     customer_order @relation(fields: [orderId], references: [id])
  product   Product        @relation(fields: [productId], references: [id])
}
```

#### 6. **Wishlist** - قائمة الأمنيات
```prisma
model Wishlist {
  id        String  @id @default(uuid())
  userId    String
  productId String
  
  user      User    @relation(fields: [userId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
  
  @@unique([userId, productId])
}
```

---

## 🔐 المتغيرات البيئية | Environment Variables

### Frontend (.env)
```env
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://techify-beta.vercel.app
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_BASE_URL=https://techify-production.up.railway.app
```

### Backend (server/.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🚀 API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering, sorting, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/user/:userId` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

### Wishlist
- `GET /api/wishlist/:userId` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Images
- `POST /api/main-image` - Upload product main image (Cloudinary)
- `POST /api/images` - Upload product images (Cloudinary)

### Search
- `GET /api/search?query=...` - Search products

---

## 🔒 الأمان | Security Features

### Rate Limiting
```javascript
// General: 100 requests / 15 minutes
// Auth: 5 login attempts / 15 minutes
// Register: 3 registrations / hour
// Upload: 10 uploads / 15 minutes
// Search: 30 searches / minute
// Orders: 15 operations / 15 minutes
// Wishlist: 20 operations / 5 minutes
// Products: 60 requests / minute
```

### Security Measures
- ✅ **CORS** - Configured for specific origins
- ✅ **XSS Protection** - Input sanitization
- ✅ **SQL Injection Prevention** - Prisma ORM
- ✅ **Password Hashing** - bcrypt
- ✅ **JWT Authentication** - Secure tokens
- ✅ **Request Logging** - Morgan + custom logger
- ✅ **Error Handling** - Centralized error handler
- ✅ **Input Validation** - Whitelists for filters/operators

---

## 📊 الميزات | Features

### للمستخدمين | User Features
- ✅ تصفح المنتجات مع فلترة وترتيب متقدم
- ✅ البحث عن المنتجات
- ✅ إضافة المنتجات إلى السلة
- ✅ قائمة الأمنيات (Wishlist)
- ✅ إتمام الطلبات (Checkout)
- ✅ تتبع الطلبات
- ✅ حساب شخصي (Profile)
- ✅ المصادقة (Login/Register)

### للمسؤولين | Admin Features
- ✅ لوحة تحكم شاملة
- ✅ إدارة المنتجات (CRUD)
- ✅ إدارة الفئات (CRUD)
- ✅ إدارة الطلبات
- ✅ إدارة المستخدمين
- ✅ رفع الصور (Cloudinary)
- ✅ إحصائيات المبيعات

---

## 🛠️ التثبيت والتشغيل | Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/mallouk2020/techify.git
cd techify
```

### 2. Install Frontend Dependencies
```bash
npm install
# or
yarn install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
```

### 4. Setup Environment Variables
```bash
# Frontend
cp .env.example .env
# Edit .env with your values

# Backend
cd server
cp .env.example .env
# Edit .env with your values
```

### 5. Setup Database
```bash
cd server
npx prisma generate
npx prisma migrate deploy
```

### 6. Run Development Servers

**Frontend:**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:3001
```

---

## 🌐 النشر | Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

**Live URL**: https://techify-beta.vercel.app

### Backend (Railway)
1. Push to GitHub
2. Connect repository to Railway
3. Set environment variables
4. Deploy

**Live URL**: https://techify-production.up.railway.app

### Database (Railway)
- PostgreSQL hosted on Railway
- Automatic backups
- SSL enabled

---

## 🐛 المشاكل المحلولة | Fixed Issues

### Issue #1: ERR_REQUIRE_ESM
**المشكلة**: `nanoid` v5 يستخدم ESM فقط
**الحل**: استبدال `nanoid` بـ `uuid` في `requestLogger.js`

```javascript
// Before
const { nanoid } = require('nanoid');
req.reqId = nanoid(8);

// After
const { v4: uuidv4 } = require('uuid');
req.reqId = uuidv4().substring(0, 8);
```

### Issue #2: Prisma Client Not Generated on Vercel
**المشكلة**: Vercel لا يولد Prisma Client تلقائياً
**الحل**: إضافة `vercel-build` script

```json
{
  "scripts": {
    "vercel-build": "prisma generate"
  }
}
```

### Issue #3: Build Cache Issues
**المشكلة**: Vercel/Railway يستخدم build cache قديم
**الحل**: إعادة النشر بدون cache

---

## 📝 ملاحظات مهمة | Important Notes

### Database Connection
- ✅ استخدام Prisma Client Singleton
- ✅ SSL enabled للاتصال الآمن
- ✅ Connection pooling

### File Uploads
- ✅ جميع الصور مرفوعة على Cloudinary
- ✅ حد أقصى 10MB للملف
- ✅ تنظيف الملفات المؤقتة تلقائياً

### Authentication
- ✅ NextAuth.js للـ Frontend
- ✅ JWT للـ Backend API
- ✅ Session timeout: 30 days

### Rate Limiting
- ✅ مفعّل على جميع endpoints
- ✅ حماية من DDoS
- ✅ Logs للطلبات المشبوهة

---

## 🔄 Git Workflow

### Branches
- `main` - Production branch (stable)
- `dev` - Development branch
- `feature/*` - Feature branches

### Commit Messages
```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"
git commit -m "refactor: improve code structure"
```

---

## 📦 الملفات الأساسية | Core Files

### Frontend
| File | Description |
|------|-------------|
| `app/layout.tsx` | Root layout |
| `app/page.tsx` | Home page |
| `lib/api.ts` | API client |
| `lib/auth-options.ts` | NextAuth config |
| `middleware.ts` | Route protection |
| `next.config.mjs` | Next.js config |
| `tailwind.config.ts` | Tailwind config |

### Backend
| File | Description |
|------|-------------|
| `server/app.js` | Express app entry |
| `server/controllers/products.js` | Products logic |
| `server/routes/products.js` | Products routes |
| `server/utills/db.js` | Prisma client |
| `server/utills/errorHandler.js` | Error handling |
| `server/middleware/rateLimiter.js` | Rate limiting |
| `server/prisma/schema.prisma` | Database schema |
| `server/package.json` | Dependencies |

---

## 🎯 الخطوات القادمة | Next Steps

### Planned Features
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Product reviews & ratings
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA support
- [ ] Real-time order tracking

### Performance Improvements
- [ ] Image optimization (Next.js Image)
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Caching strategies
- [ ] Database indexing

---

## 📞 الدعم | Support

### Issues
إذا واجهت أي مشكلة:
1. تحقق من Logs (Frontend: Vercel, Backend: Railway)
2. تأكد من Environment Variables
3. تحقق من Database connection
4. راجع هذا الملف

### Logs Location
- **Frontend**: Vercel Dashboard → Deployments → Logs
- **Backend**: Railway Dashboard → Deployments → Logs
- **Local Backend**: `server/logs/` directory

---

## ✅ Checklist للنشر | Deployment Checklist

### قبل النشر
- [ ] جميع Environment Variables محدثة
- [ ] Database migrations مطبقة
- [ ] Tests تعمل بنجاح
- [ ] No console errors
- [ ] Images optimized
- [ ] Security headers configured

### بعد النشر
- [ ] Frontend يعمل بشكل صحيح
- [ ] Backend API يستجيب
- [ ] Database متصلة
- [ ] Images تظهر بشكل صحيح
- [ ] Authentication يعمل
- [ ] Rate limiting مفعّل

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 المطور | Developer

**Project**: Techify E-Commerce Platform  
**Version**: 1.3.0 (Stable)  
**Last Updated**: January 2025  
**Status**: ✅ Production Ready

---

## 🎉 ملخص النسخة الحالية | Current Version Summary

### ✅ ما تم إنجازه
1. ✅ إصلاح مشكلة `ERR_REQUIRE_ESM`
2. ✅ إضافة `vercel-build` script
3. ✅ تنظيف الملفات الزائدة
4. ✅ توثيق شامل للمشروع
5. ✅ Backend يعمل على Railway
6. ✅ Frontend يعمل على Vercel
7. ✅ Database على Railway
8. ✅ Rate limiting مفعّل
9. ✅ Security measures مطبقة
10. ✅ Logging system يعمل

### 🚀 الحالة الحالية
- **Frontend**: ✅ Live on Vercel
- **Backend**: ✅ Live on Railway
- **Database**: ✅ PostgreSQL on Railway
- **Images**: ✅ Cloudinary
- **Status**: ✅ **STABLE & PRODUCTION READY**

---

**🎯 هذه نسخة نظيفة ومستقرة - يمكن العودة إليها في أي وقت!**