# Rent-a-Mac — Digital Advertising Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2d3748)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Integration-635bff)](https://stripe.com/)

> **Rent a spot on the internet's MacBook.**

Rent-a-Mac is a full-stack digital advertising marketplace where businesses, creators, developers, and individuals can rent high-visibility advertising space displayed on an interactive virtual MacBook mockup on the website homepage.

---

## 1. Product Concept & Features
- **Interactive MacBook Surface**: Realistic CSS/SVG MacBook mockup featuring camera notch, top menu bar, dock area, screen center, side flanks, and trackpad palm-rest advertising zones.
- **Mobile-Responsive Inventory**: Dedicated card grid ([SlotsGrid.tsx](components/public/SlotsGrid.tsx)) for mobile devices (320px–430px) ensuring complete usability without tiny clipped controls.
- **Database-Backed Inventory**: Relational schema powering dynamic slot statuses (`AVAILABLE`, `PENDING`, `RESERVED`, `OCCUPIED`, `DISABLED`).
- **Server-Side Pricing Engine**: Server-calculated pro-rated rates featuring duration discounts (7-day base rate, 30-day 15% discount, 90-day 30% discount).
- **Date Overlap Prevention**: Server-side collision detection to prevent double bookings.
- **Stripe Checkout & Webhooks**: Server-side checkout session creation and idempotent webhook processing (`/api/webhooks/stripe`).
- **24-Hour Admin Moderation Queue**: Paid advertisements transition to `PENDING_REVIEW` before going live upon admin approval.
- **Protected Admin Portal**: Comprehensive revenue metrics, pending approvals moderation, and slot configuration.
- **Advertiser Portal**: Self-serve dashboard for tracking active/past rentals, payment status, and creative details.

---

## 2. Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+ (Strict Mode)
- **Styling**: Tailwind CSS, Lucide Icons, Framer Motion
- **Database & ORM**: Prisma ORM with SQLite (Local Dev) & PostgreSQL (Production Supabase / Neon / Vercel Postgres)
- **Authentication**: JWT Cookie Session with Role-Based Access Control (`ADMIN` vs `USER`)
- **Payment Layer**: Stripe Node SDK & Webhook Verification
- **Validation**: Zod Validation Schemas

---

## 3. Local Installation
```bash
# 1. Clone Repository
git clone https://github.com/hariom-wdsadhunik/rent-a-mac.git
cd rent-a-mac

# 2. Install Dependencies
npm install

# 3. Configure Environment File
cp .env.example .env
```

---

## 4. Environment Variables
Copy `.env.example` to `.env`:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"
JWT_SECRET="rent-a-mac-super-secret-jwt-key-change-in-prod-12345"
ADMIN_EMAIL="admin@rent-a-mac.com"
ADMIN_INITIAL_PASSWORD="AdminPassword123!"

# Stripe (Optional in dev, uses mock checkout fallback if empty)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

---

## 5. Database Setup & Seeding
```bash
# Synchronize Prisma schema with local database
npx prisma db push

# Seed initial advertising slots and admin user
npm run db:seed
```

---

## 6. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Running Tests
```bash
# Run server pricing logic unit tests
npm run test
```

---

## 8. Production Build
```bash
# Compile TypeScript typecheck and Next.js production bundle
npm run typecheck
npm run build
```

---

## 9. GitHub Workflow
Follow conventional commits when making changes:
```bash
npm run typecheck
npm run test
npm run build
git add .
git commit -m "feat: implement new advertising feature"
git push origin main
```

---

## 10. Vercel Deployment
1. Push repository to GitHub.
2. Log into [Vercel](https://vercel.com/new) and import `rent-a-mac`.
3. Add environment variables from Section 4.
4. Deployment command automatically executes `prisma generate && next build`.

---

## 11. Stripe Setup
1. Enable Stripe Keys in `.env`.
2. Configure Webhook Endpoint in Stripe Dashboard pointing to `https://your-domain.vercel.app/api/webhooks/stripe`.
3. Select `checkout.session.completed` event and set `STRIPE_WEBHOOK_SECRET`.

---

## 12. Admin Setup
Default admin credentials seeded locally:
- **URL**: `/login`
- **Email**: `admin@rent-a-mac.com`
- **Password**: `AdminPassword123!`

Logging in automatically redirects to the protected `/admin` control panel.

---

## 13. Known Limitations & Production Notes
- Local development utilizes SQLite for zero-config startup; production deployments on Vercel require a PostgreSQL instance (Neon / Supabase).
- In development environments without active Stripe secret keys, a test checkout mock is automatically engaged for end-to-end user testing.
