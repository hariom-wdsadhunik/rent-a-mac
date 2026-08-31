# SYSTEM ARCHITECTURE — RENT-A-MAC

## 1. System Overview
Rent-a-Mac is built as a full-stack Next.js application using the App Router, leveraging Server Components for rendering performance and Server Actions / API Routes for secure business logic execution.

```
+-----------------------------------------------------------------------+
|                               CLIENT                                  |
|   Browser (Interactive MacBook Mockup, Checkout Modal, Dashboards)    |
+-----------------------------------+-----------------------------------+
                                    |
                                    | HTTPS / JSON / Server Actions
                                    v
+-----------------------------------------------------------------------+
|                          NEXT.JS APP ROUTER                           |
|                                                                       |
|  +-----------------------+ +------------------+ +------------------+  |
|  | Server Components     | | API Routes /     | | Middleware & Auth|  |
|  | (SEO, SSR, Pages)     | | Server Actions   | | (RBAC, Cookies) |  |
|  +-----------------------+ +------------------+ +------------------+  |
+-------------------+-------------------+-------------------+-----------+
                    |                   |                   |
                    v                   v                   v
+-------------------+---+       +-------+-------+   +-------+-------+
|  Prisma ORM       |       |  Stripe API   |   |  File Storage |
|  (PostgreSQL/    |       |  (Checkout /  |   |  (Public Local|
|   SQLite DB)      |       |   Webhooks)   |   |   / S3 Upload)|
+-----------------------+       +---------------+   +---------------+
```

---

## 2. Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+ (Strict Mode)
- **Styling**: Tailwind CSS, Lucide React (Icons), Framer Motion (Animations)
- **Database / ORM**: Prisma ORM with PostgreSQL (Vercel Postgres / Supabase / Neon compatible) & SQLite support for local dev.
- **Authentication**: Custom JWT / Encrypted Cookie Authentication with Role-Based Access Control (`ADMIN`, `USER`).
- **Payment Processing**: Stripe Node SDK & Webhook handlers.
- **Form Validation**: Zod validation schemas shared between Client & Server.
- **Deployment**: Vercel Serverless Platform.

---

## 3. Directory Structure
```
d:/Rent-a-Mac/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Homepage with Interactive MacBook
│   │   ├── slots/[slug]/page.tsx    # Slot detail page
│   │   ├── checkout/page.tsx        # Checkout page
│   │   ├── checkout/success/page.tsx# Payment confirmation
│   │   ├── faq/page.tsx             # FAQ page
│   │   ├── terms/page.tsx           # Terms of service
│   │   └── privacy/page.tsx         # Privacy policy
│   ├── (auth)/
│   │   ├── login/page.tsx           # Login page
│   │   ├── register/page.tsx        # Register page
│   │   └── logout/route.ts          # Logout action
│   ├── (dashboard)/
│   │   ├── admin/                   # Protected Admin Dashboard
│   │   │   ├── page.tsx             # Admin Overview
│   │   │   ├── rentals/page.tsx     # Admin Rentals Management
│   │   │   ├── slots/page.tsx       # Admin Slots Management
│   │   │   ├── ads/page.tsx         # Admin Ad Approvals
│   │   │   └── orders/page.tsx      # Admin Orders Management
│   │   └── advertiser/              # Protected Advertiser Dashboard
│   │       ├── page.tsx             # Advertiser Overview
│   │       └── rentals/page.tsx     # Advertiser Rentals
│   ├── api/
│   │   ├── checkout/route.ts        # Create Checkout Session / Order
│   │   ├── webhooks/stripe/route.ts # Webhook handler
│   │   ├── upload/route.ts          # Secure file upload endpoint
│   │   ├── slots/route.ts           # Public Inventory API
│   │   └── admin/...                # Protected Admin API endpoints
│   ├── globals.css                  # Global styles & MacBook CSS
│   ├── layout.tsx                   # Root layout
│   └── sitemap.ts / robots.ts       # SEO Generators
├── components/
│   ├── macbook/
│   │   ├── MacBookMockup.tsx        # Interactive MacBook Screen & Housing
│   │   ├── AdSlotOverlay.tsx        # Individual CSS/SVG Ad Slot
│   │   └── SlotInspectModal.tsx     # Slot Quick Details Modal
│   ├── public/                      # Hero, HowItWorks, Pricing, FAQ, Footer
│   ├── admin/                       # Admin tables, stats, approval panels
│   ├── advertiser/                  # Advertiser rental cards & edit modals
│   └── ui/                          # Button, Card, Badge, Modal, Input, Toast
├── lib/
│   ├── db.ts                        # Prisma Client Singleton
│   ├── auth.ts                      # Auth utilities & JWT session handler
│   ├── pricing.ts                   # Server-side pricing calculation logic
│   ├── availability.ts              # Server-side slot availability check
│   ├── stripe.ts                    # Stripe integration helper
│   ├── validation.ts                # Zod schemas
│   └── seed.ts                      # Demo data seeder
├── prisma/
│   ├── schema.prisma                # Database relational schema
│   └── migrations/                  # Migration SQL files
├── public/
│   ├── uploads/                     # Local uploaded ad logos/creatives
│   └── images/                      # Static assets
├── PRODUCT_REQUIREMENTS.md
├── ARCHITECTURE.md
├── DATABASE_SCHEMA.md
├── DEPLOYMENT.md
├── IMPLEMENTATION_PLAN.md
└── package.json
```

---

## 4. Key Business Logic Architecture

### 4.1 Server-Side Price Calculation
Price is NEVER calculated on the client. The client sends `slotId`, `durationDays`, and `startDate`. The server calculates:
$$\text{Total Price} = \text{Base Price} \times \frac{\text{Duration Days}}{7} \times (1 - \text{Discount Rate})$$
Discounts:
- 7 Days: 0% discount
- 30 Days: 15% discount
- 90 Days: 30% discount

### 4.2 Overlap Prevention (Availability Engine)
Before generating a payment session or placing an order, the server queries:
```sql
SELECT COUNT(*) FROM rentals 
WHERE slot_id = :slotId 
  AND status IN ('PAID', 'PENDING_REVIEW', 'ACTIVE', 'RESERVED')
  AND (
    (start_date <= :endDate AND end_date >= :startDate)
  )
```
If count > 0, the slot is unavailable for the selected window, blocking order creation.

### 4.3 Stripe Webhook Flow & Idempotency
1. User completes checkout.
2. Stripe sends `checkout.session.completed` event to `/api/webhooks/stripe`.
3. Server validates event signature with `STRIPE_WEBHOOK_SECRET`.
4. Server retrieves transaction ID and checks if `Payment` record exists in DB.
5. If already processed, returns `200 OK` (Idempotent).
6. If new, updates `Order`/`Rental` status to `PENDING_REVIEW` and records `Payment` record.
