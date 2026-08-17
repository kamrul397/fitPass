# ⚙️ FitPass Server (Express + TypeScript + MongoDB)

Backend API server for **FitPass**, handling authentication, Stripe checkout & webhooks, plan management, and role-based access control.

⚡ **Backend Production API**: [https://fitpass-hx0c.onrender.com](https://fitpass-hx0c.onrender.com)  
🌐 **Frontend Production App**: [https://fit-pass-omega.vercel.app](https://fit-pass-omega.vercel.app)

---

## ⚡ Tech Stack

- **Runtime**: Node.js + Express.js v5
- **Language**: TypeScript (`tsx` / `tsc`)
- **Database**: MongoDB Atlas + Mongoose ORM
- **Authentication**: JWT (`jsonwebtoken`) in HTTP-Only Cookies + `cookie-parser`
- **Payments**: Stripe SDK & Webhook verification

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env` in this directory (or add in Render Environment Variables):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=https://fit-pass-omega.vercel.app
NODE_ENV=production
```

### 3. Seed Initial Database Plans
```bash
npx tsx src/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`.
