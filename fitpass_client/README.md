# 🏋️ FitPass Client (Next.js 16 + React 19)

Frontend repository for **FitPass**, a full-stack SaaS Gym Subscription Platform.

🌐 **Live Deployed App**: [https://fit-pass-azure.vercel.app](https://fit-pass-azure.vercel.app)

---

## ⚡ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + DaisyUI
- **State & Caching**: TanStack Query v5 (React Query)
- **Forms & Validation**: React Hook Form + Zod
- **Authentication**: Firebase Auth (Email/Password & Google Sign-In)
- **Icons & Motion**: Lucide React + Framer Motion
- **HTTP Client**: Axios

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in this directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📁 Key Routes

- `/`: Landing page with Hero, Features, Pricing Plans, FAQ, Contact.
- `/pricing`: Membership plan selection & Stripe payment trigger.
- `/auth`: Login & Registration tabbed interface with Firebase Auth.
- `/dashboard`: User profile, current subscription, proration breakdown, payment history.
- `/admin`: Administrative analytics dashboard & user manager.
- `/payment/success` & `/payment/cancel`: Checkout redirection pages.
