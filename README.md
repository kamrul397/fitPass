# 🏋️ FitPass – Full-Stack SaaS Gym Subscription Platform

[![Frontend Live](https://img.shields.io/badge/Frontend_Live-https%3A%2F%2Ffit--pass--azure.vercel.app-7C3AED?style=for-the-badge&logo=vercel)](https://fit-pass-azure.vercel.app)
[![Backend Live](https://img.shields.io/badge/Backend_Live-https%3A%2F%2Ffitpass--2kco.onrender.com-46E3B7?style=for-the-badge&logo=render)](https://fitpass-2kco.onrender.com)
![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Express.js](https://img.shields.io/badge/Express.js-5.2-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)

> **FitPass** is a production-grade full-stack SaaS web application where users can discover, purchase, and manage nationwide gym membership subscriptions using Stripe. Built with clean architecture, strict TypeScript, secure HTTP-Only JWT authentication, and smart proration for plan switches.

🌐 **Frontend Application (Vercel)**: [https://fit-pass-azure.vercel.app](https://fit-pass-azure.vercel.app)  
⚡ **Backend API Server (Render)**: [https://fitpass-2kco.onrender.com](https://fitpass-2kco.onrender.com)

---

## 📸 Key Features

- **⚡ Modern Dark & Glassmorphism Interface**: Designed with Next.js 16 App Router, React 19, Tailwind CSS v4, DaisyUI, and Framer Motion micro-animations.
- **🔐 Hybrid Firebase & HTTP-Only JWT Auth**:
  - Firebase Authentication for Email/Password and Google Sign-In on the client.
  - Backend verifies identity and issues an **HTTP-Only JWT Cookie** (`sameSite: "none"` in prod) shielding tokens against XSS attacks.
- **💳 Complete Stripe Payment Engine**:
  - Secure Stripe Checkout sessions for subscription purchases.
  - Asynchronous webhook listener (`/api/payments/webhook`) with raw-body signature verification for idempotent order fulfillment.
- **🔄 Smart Proration Engine**:
  - Calculates unused days on active plans when upgrading or downgrading.
  - Stores and applies user credit balances dynamically to future plan payments.
- **🛡️ Role-Based Access Control (RBAC)**:
  - Strict middleware route protection in Next.js (`/dashboard`) and Express API verification.
  - Dedicated **User Dashboard** and **Admin Dashboard**.
- **📊 Admin Control Center**:
  - Real-time key metrics: Total Users, Total Revenue, Active Subscribers, Monthly Income.
  - User role management and payment history tracking.
- **🚀 TanStack Query v5 Integration**: Client-side query caching, loading skeletons, error boundaries, and optimistic UI updates.

---

## 🛠️ Tech Stack

### Frontend (`fitpass_client`)
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + DaisyUI
- **State & Data Fetching**: TanStack Query v5 (React Query)
- **Forms & Validation**: React Hook Form + Zod
- **Auth**: Firebase Client SDK (Email & Google Auth)
- **Icons & Animations**: Lucide React + Framer Motion
- **HTTP Client**: Axios

### Backend (`server_fitpass`)
- **Runtime**: Node.js + Express.js (v5)
- **Language**: TypeScript (`tsx` dev runner, `tsc` builder)
- **Database**: MongoDB Atlas + Mongoose ORM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `cookie-parser`
- **Security & CORS**: CORS whitelist, HTTP-only Cookie storage
- **Payment Processing**: Stripe Node SDK

---

## 📁 Repository Structure

```text
FitPass/
├── fitpass_client/                 # Next.js 16 Frontend Application
│   ├── src/
│   │   ├── app/                    # App Router (pages: /, /auth, /pricing, /dashboard, /admin)
│   │   ├── components/             # Reusable UI Components (Navbar, PlanCards, Hero, etc.)
│   │   ├── hooks/                  # Custom React Hooks (useGoogleAuth, useAuthUser)
│   │   ├── lib/                    # Firebase client initialization
│   │   ├── middleware.ts           # Next.js Edge Middleware for route protection
│   │   ├── providers/              # TanStack Query Provider
│   │   └── types/                  # TypeScript interfaces & types
│   └── package.json
│
└── server_fitpass/                 # Express + TypeScript Backend API
    ├── src/
    │   ├── config/                 # DB connection (Mongoose)
    │   ├── controllers/            # Logic (authController, paymentController, userController)
    │   ├── middlewares/            # Auth verification middleware (JWT)
    │   ├── models/                 # Mongoose Schemas (User, Subscription, Payment, Plans)
    │   ├── routes/                 # Express API routes
    │   ├── seed.ts                 # Database seeder for subscription plans
    │   └── index.ts                # Express application entrypoint
    └── package.json
```

---

## 💳 Membership Plans

| Plan | Price | Features Included |
| :--- | :--- | :--- |
| **Basic** | `$9.99 / mo` | Standard Gym Access, Locker Room Access, Basic Cardio & Weight Equipment |
| **Premium** | `$19.99 / mo` | Everything in Basic, All Group Fitness Classes, 1 Weekly Personal Trainer Session |
| **Elite** | `$39.99 / mo` | Everything in Premium, Unlimited Personal Trainer Access, VIP Lounge & Nutrition Consultation |

---

## ⚙️ Environment Variables Setup

### 1. Frontend (`fitpass_client`) — Vercel Settings
```env
NEXT_PUBLIC_API_URL=https://fitpass-2kco.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 2. Backend (`server_fitpass`) — Render Settings
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fitpass?retryWrites=true&w=majority
JWT_SECRET=your_jwt_super_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
FRONTEND_URL=https://fit-pass-azure.vercel.app
NODE_ENV=production
```

---

## 🚀 Getting Started locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas cluster connection string
- Stripe Developer Account (Test API keys)
- Firebase Project with Email/Password & Google Auth enabled

### 1. Clone the repository
```bash
git clone https://github.com/kamrul397/fitPass.git
cd fitPass
```

### 2. Setup & Start Backend Server
```bash
cd server_fitpass
npm install

# Seed the initial subscription plans into MongoDB
npx tsx src/seed.ts

# Start backend dev server
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Setup & Start Frontend Client
In a new terminal window:
```bash
cd fitpass_client
npm install

# Start Next.js dev server
npm run dev
```
The application will be accessible at `http://localhost:3000`.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/jwt` | Verify Firebase user & set HTTP-Only JWT Cookie | No |
| `POST` | `/api/auth/logout` | Clear JWT Cookie & log out | Yes |
| `GET` | `/api/auth/me` | Fetch currently logged in user profile | Yes |
| `GET` | `/api/plans` | Fetch available membership plans | No |
| `POST` | `/api/payments/create-checkout-session` | Initialize Stripe Checkout session | Yes |
| `POST` | `/api/payments/webhook` | Stripe Webhook handler (raw body) | Signature |
| `GET` | `/api/payments/history` | Retrieve user payment history & invoices | Yes |
| `GET` | `/api/users/analytics` | Fetch admin analytics summary | Admin |
| `GET` | `/api/users` | List all users (Admin view) | Admin |
| `PATCH` | `/api/users/:id` | Update user role / status | Admin |

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for details.

---

<p align="center">
  Frontend: <a href="https://fit-pass-azure.vercel.app">fit-pass-azure.vercel.app</a> | Backend: <a href="https://fitpass-2kco.onrender.com">fitpass-2kco.onrender.com</a>
</p>
