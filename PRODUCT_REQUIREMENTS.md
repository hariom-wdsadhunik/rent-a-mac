# PRODUCT REQUIREMENTS — RENT-A-MAC

## 1. Executive Summary
Rent-a-Mac is a digital advertising marketplace that allows businesses, creators, developers, and individuals to rent advertising space displayed on a virtual MacBook mockup on the platform's homepage. The product acts as a premium digital billboard.

---

## 2. Target Audience & Roles
- **Visitors / Prospective Advertisers**: Inspect available ad spots on the virtual MacBook, check pricing and duration options, and submit advertisements.
- **Advertisers (Users)**: Manage active, upcoming, and past ad rentals, view status updates, and modify ad creative where permitted.
- **Administrators**: Moderate submitted advertisements (Approve, Reject, Request Changes, Suspend, Extend, Cancel), manage advertising slots (pricing, positions, status), and monitor revenue analytics.

---

## 3. Core Features & Requirements

### 3.1 Public Experience & Interactive MacBook
- **Hero Section**: Headline ("Rent a spot on the internet's MacBook"), subheadline, primary CTA ("Rent Your Spot"), secondary CTA ("Explore Available Spots").
- **Interactive MacBook**: CSS/SVG responsive MacBook display featuring interactive ad slots (e.g. `Slot A1`, `Slot A2`, `Slot B1`, `Slot B2`, `Featured Banner`, `Top Notch Bar`, `Dock Badge`).
- **Slot Interaction**:
  - Hovering displays slot name, price, dimensions, availability status, and preview.
  - Clicking opens modal/drawer with full details, availability calendar, and rental options.
- **Mobile Experience**: Adapted layout ensuring full usability on mobile viewports (320px+) without tiny clipped controls or horizontal scroll overflow.
- **Marketing Sections**: How It Works, Available Advertising Spots Grid, Transparent Pricing, Value Proposition ("Why Advertise Here"), FAQ Accordion, Final CTA, Footer.

### 3.2 Inventory & Slot Management
- Slots stored in database with fields: `id`, `name`, `slug`, `description`, `position`, `width`, `height`, `base_price`, `status`, `available_from`, `available_until`.
- Valid Slot Statuses: `AVAILABLE`, `PENDING`, `RESERVED`, `OCCUPIED`, `DISABLED`.
- Dynamic server-backed availability calculations (no client-side hardcoding).

### 3.3 Rental & Checkout Flow
- Select duration (7 days, 30 days, 90 days).
- Server-calculated dynamic pricing with duration discounts.
- Server-side availability overlap check prior to checkout session creation.
- Checkout form collecting Advertiser Name, Email, Brand Name, Target Website URL, Ad Logo/Image, Start Date, and Selected Slot.
- Form validation: URL format, image MIME types (PNG, JPG, SVG, WebP, GIF), file size limits (<= 5MB), date validation.

### 3.4 Payment & Processing
- Integration layer for Stripe Checkout.
- Server-side price validation & payment session creation.
- Webhook endpoint (`/api/webhooks/stripe`) with signature verification and idempotent processing.
- Rental status transitioned to `PENDING_REVIEW` upon verified payment webhook signal.

### 3.5 Approval & Moderation Workflow
- All paid advertisements enter `PENDING_REVIEW` state.
- Admin review actions: `APPROVE` (transitions status to `ACTIVE`), `REJECT` (with refund/reason note), `REQUEST_CHANGES`, `SUSPEND`, `EXTEND`, `CANCEL`.
- Active ads render live on the MacBook display for their designated rental duration window.
- Automatic background/query filter to ensure expired rentals automatically cease displaying.

### 3.6 Dashboards & Admin Controls
- **Admin Dashboard**:
  - Revenue metrics, active rentals count, pending approval queue, occupancy rate, upcoming expirations.
  - Rental management, Slot configuration (create/edit/disable), Ad creative reviewer, Order history.
- **Advertiser Dashboard**:
  - List of active, pending, and past rentals.
  - Status indicators and rental detail views.
  - Creative updating interface (for pending/active ads with re-approval queue).

### 3.7 Security, SEO, & Performance
- Server-side authentication & RBAC (`ADMIN` vs `USER`).
- Protection against XSS, CSRF, arbitrary file uploads, and price tampering.
- Complete SEO metadata (OpenGraph, Twitter Cards, Sitemap, Robots.txt, semantic HTML).
- ARIA accessibility compliance (keyboard navigation for MacBook slots, high-contrast focus rings, screen reader support).
