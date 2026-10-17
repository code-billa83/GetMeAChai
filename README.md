# ☕ Get Me A Chai — Creator Crowdfunding Platform

A full-stack creator crowdfunding platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Razorpay Payments**, **NextAuth.js**, and **MongoDB**. 

Supporters can fund developers, artists, and creators with micro-donations in the form of a "cup of chai" (₹10, ₹20, ₹50, etc.) through instant UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, and NetBanking.

---

## 🌟 Key Features

- **⚡ Razorpay Payment Gateway Integration**:
  - Secure order creation via Next.js Server Actions.
  - Seamless in-page checkout modal via official Razorpay SDK (`https://checkout.razorpay.com/v1/checkout.js`).
  - Cryptographic server-side HMAC-SHA256 signature verification.
  - Dual support: Real-time client verification handler + HTTP 303 Redirect for browser form posts.
- **🎨 Modern Dark Glassmorphism UI**:
  - Warm amber-chai aesthetic with glass panels, glowing borders, and micro-interactions.
  - Interactive **Chai Earnings Calculator** on the home page.
  - Live public supporter wall with rankings and heartfelt messages.
  - Instant one-click presets (1 Chai ₹10, 2 Chais ₹20, 5 Chais ₹50, etc.).
- **🔐 Flexible Authentication (NextAuth.js)**:
  - **GitHub OAuth**: Full production authentication with user profiles.
  - **1-Click Demo Evaluation Sign In**: Test creator dashboard immediately as `@shiva` or custom username without external API setup.
- **🛠️ Creator Dashboard**:
  - Real-time profile preview card.
  - Custom Razorpay API credentials toggle (use platform keys or route funds to personal Razorpay account).
  - Shareable profile link copy with toast notification.
- **🛡️ Senior Architecture & Resilience**:
  - Mongoose connection caching to prevent connection leaks during Fast Refresh.
  - Resilient dual-store fallback so the app works seamlessly even if local MongoDB is offline during testing.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **npm** or **yarn** / **pnpm**

### 2. Installation
```bash
# Navigate to the project directory
cd projectwithShiva

# Install dependencies
npm install
```

### 3. Environment Configuration (`.env.local`)
Create or edit `.env.local`:

```env
# GitHub OAuth (Optional for demo mode)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# MongoDB Database Connection
MONGODB_URI=mongodb://localhost:27017/mishra_db

# Razorpay API Credentials (Test or Live)
RAZORPAY_KEY_ID=rzp_test_To3nMfOQptCHHU
RAZORPAY_KEY_SECRET=ZE6ABgNjMJmPHczPv7FihRnn
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_To3nMfOQptCHHU

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YourSuperSecretKey123##
```

### 4. Running the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
projectwithShiva/
├── actions/
│   └── useractions.js          # Next.js Server Actions (initiate, fetchuser, fetchpayments, updateProfile)
├── app/
│   ├── [username]/             # Dynamic creator profile & donation page
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth authentication route (GitHub + Demo Credentials)
│   │   └── razorpay/           # HMAC-SHA256 signature verification endpoint (POST)
│   ├── dashboard/              # Creator settings & profile customizer
│   ├── login/                  # Authentication page
│   ├── about/                  # About & platform mission
│   ├── globals.css             # Tailwind CSS v4 & custom glassmorphism styles
│   ├── layout.js               # Root layout & Razorpay Checkout script loader
│   └── page.js                 # High-converting landing page with earnings calculator
├── components/
│   ├── Navbar.js               # Responsive glassmorphism header & mobile drawer
│   ├── Footer.js               # Modern footer with quick navigation & system status
│   ├── PaymentPage.js          # Core donation box, preset chips & Razorpay checkout
│   ├── Dashboard.js            # Creator dashboard with live profile preview card
│   └── SessionWrapper.js       # NextAuth SessionProvider wrapper
├── db/
│   └── connectDb.js            # Production-cached Mongoose connection with fallback resilience
└── models/
    ├── User.js                 # User & creator schema
    └── Payment.js              # Payment transactions schema
```

---

## 🔒 Security Best Practices Implemented

1. **HMAC-SHA256 Verification**: Payments are never marked as completed without verifying the cryptographic signature `crypto.createHmac("sha256", secret).update(orderId + "|" + paymentId).digest("hex")`.
2. **Secret Protection**: `razorpaysecret` is strictly excluded from client-facing Server Actions and API responses.
3. **HTTP 303 See Other Redirect**: Form submissions from Razorpay iframe redirect using status `303` rather than `307`, preventing `405 Method Not Allowed` errors.
4. **Input Sanitization**: User handles, donation amounts, and input parameters are validated and sanitized before database writes.

---

## ☕ Support & License
Open source and crafted with ☕ for creators worldwide.
