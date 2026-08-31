# IMPLEMENTATION PLAN — RENT-A-MAC

Rent-a-Mac is a digital advertising marketplace allowing businesses, creators, and individuals to rent advertising space displayed on a virtual MacBook interface on the website homepage.

---

## 1. Project Phases & Milestones

### Phase 1: Inspection & Requirements Documentation (Completed)
- Inspect workspace.
- Generate `PRODUCT_REQUIREMENTS.md`, `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `DEPLOYMENT.md`, `IMPLEMENTATION_PLAN.md`.

### Phase 2: Core Infrastructure & Database Setup (Completed)
- Initialize Next.js 14 App Router project with TypeScript, Tailwind CSS, and Lucide icons.
- Configure Prisma ORM with SQLite database schema for local dev and PostgreSQL compatibility.
- Write database seeder (`lib/seed.ts`) to populate initial advertising slots and default admin credentials.

### Phase 3: Core Business Logic (Completed)
- Implement `lib/pricing.ts` for server-side duration-discount calculations.
- Implement `lib/availability.ts` for overlap detection to prevent double-booking.
- Implement `lib/auth.ts` for role-based authentication and secure session cookies.

### Phase 4: Interactive MacBook Component (Completed)
- Construct CSS/SVG premium MacBook mockup with realistic lid, screen bezel, notch, keyboard, and trackpad.
- Create dynamic `AdSlotOverlay` components mapped to slot positions, supporting hover previews, status badges, price tags, and click selection.
- Implement mobile-responsive alternative grid view (`SlotsGrid`) for touch devices.

### Phase 5: Public Homepage & Navigation (Completed)
- Build Hero section, How It Works, Transparent Pricing, Why Advertise Here, FAQ Accordion, CTAs, and Footer.
- Connect live inventory state from database to MacBook display.

### Phase 6: Rental Flow & Checkout Page (Completed)
- Build `/checkout` page with multi-step flow: slot preview, date range picker, duration selector, ad creative image upload with preview, and advertiser contact details.
- Build server API `/api/checkout` to validate price and date availability before session creation.
- Integrate Stripe payment session generation with dev mock fallback.

### Phase 7: Webhook Processing & Moderation Workflow (Completed)
- Build `/api/webhooks/stripe` with signature verification and idempotent payment processing.
- Transition rentals to `PENDING_REVIEW` upon payment signal.

### Phase 8: Admin & Advertiser Dashboards (Completed)
- Protected Admin Dashboard (`/admin`) with total revenue, active rentals, pending approvals queue, occupancy metrics, slot management, and ad approval/rejection actions.
- Protected Advertiser Dashboard (`/advertiser`) to view active/past rentals, payment status, and ad creative details.

### Phase 9: Testing, SEO & Security Hardening (Completed)
- Add server unit tests for pricing discounts (`npm run test`).
- Add SEO metadata, OpenGraph cards, Twitter cards, `sitemap.ts`, and `robots.ts`.
- Enforce ARIA accessibility and keyboard navigation for MacBook slots.

### Phase 10: Production Deployment Preparation & Repository Setup (Completed)
- Created remote GitHub repository: `https://github.com/hariom-wdsadhunik/rent-a-mac`.
- Pushed clean initial commit `7a50691` to `main` branch.
- Documented step-by-step Vercel import and deployment steps in `DEPLOYMENT.md` and `README.md`.
- Generated `PRODUCTION_READINESS.md` document.
