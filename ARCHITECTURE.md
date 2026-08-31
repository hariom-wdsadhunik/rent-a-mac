# SYSTEM ARCHITECTURE — RENT-A-MAC

## 1. System Overview
Rent-a-Mac is a full-stack Next.js application designed to run on Vercel and Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`).

```
+-----------------------------------------------------------------------+
|                               CLIENT                                  |
|   Browser (Interactive MacBook Mockup, Checkout Modal, Dashboards)    |
+-----------------------------------+-----------------------------------+
                                    |
                                    | HTTPS / JSON / Server Actions
                                    v
+-----------------------------------------------------------------------+
|                 NEXT.JS APP ROUTER ON CLOUDFLARE WORKERS              |
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
|  (PostgreSQL/    |       |  (Checkout /  |   |  (Local Upload|
|   Neon DB)        |       |   Webhooks)   |   |   / Cloudflare)|
+-----------------------+       +---------------+   +---------------+
```

---

## 2. Technology Stack & Deployment Architecture
- **Framework**: Next.js 14.2.18 (Pinned for OpenNext Cloudflare compatibility)
- **Deployment Adapter**: OpenNext for Cloudflare (`@opennextjs/cloudflare`) with `wrangler.jsonc` and `open-next.config.ts`.
- **Worker Flags**: `compatibility_flags = ["nodejs_compat"]`, `compatibility_date = "2024-09-23"`.
- **Database**: Prisma ORM with PostgreSQL provider (`provider = "postgresql"`) compatible with Neon PostgreSQL, Supabase, and Vercel Postgres.
- **Build Safety**: `lib/db.ts` incorporates a fallback connection string during `next build` to prevent `Environment variable not found: DATABASE_URL` crashes during static compilation when DB variables are unconfigured.
- **Dynamic Routing**: Database-dependent pages and API routes enforce `export const dynamic = 'force-dynamic'` to prevent static pre-rendering query failures during build time.

---

## 3. Cloudflare Adapter Architecture Decision
We selected **OpenNext for Cloudflare (`@opennextjs/cloudflare`)** as the standard Next.js adapter for Cloudflare Workers.
- OpenNext compiles standard Next.js App Router code into an optimized V8 isolate worker (`.open-next/worker.js`).
- Assets are served automatically via Cloudflare Assets binding (`ASSETS`).
- No framework migration or code refactoring was required.

---

## 4. Key Business Logic Architecture

### 4.1 Server-Side Price Calculation
Price is calculated on the server using `lib/pricing.ts`:
$$\text{Total Price} = \text{Base Price} \times \frac{\text{Duration Days}}{7} \times (1 - \text{Discount Rate})$$

### 4.2 Overlap Prevention Engine
Date overlap validation is enforced in `lib/availability.ts` prior to checkout session creation.

### 4.3 Stripe Webhook Handling
Verified idempotently at `/api/webhooks/stripe`.
