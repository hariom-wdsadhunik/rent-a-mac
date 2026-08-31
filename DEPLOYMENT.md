# DEPLOYMENT GUIDE — RENT-A-MAC

Complete step-by-step deployment guide for deploying Rent-a-Mac from GitHub to Vercel with PostgreSQL and Stripe integrations.

---

## First-Time Deployment Checklist (Steps 1–10)

### Step 1: Create GitHub Repository
Create a new remote repository named `rent-a-mac` on GitHub via GitHub Web interface or GitHub CLI (`gh repo create`).

### Step 2: Push Application Code
```bash
git init
git add .
git commit -m "feat: initial commit for rent-a-mac advertising platform"
git branch -M main
git remote add origin https://github.com:yourusername/rent-a-mac.git
git push -u origin main
```

### Step 3: Import Repository into Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/new).
2. Click **Add New** -> **Project**.
3. Select and import the `rent-a-mac` repository from your GitHub account.
4. Select **Framework Preset**: `Next.js`.

### Step 4: Configure Environment Variables
In Vercel Project Settings -> Environment Variables, add:
- `NEXT_PUBLIC_APP_URL`: `https://your-app-name.vercel.app`
- `DATABASE_URL`: `postgresql://user:pass@ep-host.region.aws.neon.tech/rentamac?sslmode=require`
- `JWT_SECRET`: `[Min 32-character secure secret string]`
- `ADMIN_EMAIL`: `admin@rent-a-mac.com`
- `ADMIN_INITIAL_PASSWORD`: `[Your Secure Admin Password]`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: `pk_live_...`
- `STRIPE_SECRET_KEY`: `sk_live_...`
- `STRIPE_WEBHOOK_SECRET`: `whsec_...`

### Step 5: Configure Database (Supabase / Neon / Vercel Postgres)
1. Provision a PostgreSQL database instance on Neon, Supabase, or Vercel Postgres.
2. Copy the connection pooling string (`postgresql://...`).
3. Set `DATABASE_URL` in Vercel project environment settings.

### Step 6: Run Database Migrations & Seeding
In `prisma/schema.prisma`, update provider to `postgresql` when using Postgres:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Run migrations:
```bash
npx prisma db push
npm run db:seed
```

### Step 7: Configure Payment Provider (Stripe)
1. Open Stripe Dashboard -> API Keys.
2. Retrieve `Publishable key` and `Secret key`.
3. Add them to Vercel environment variables.

### Step 8: Configure Payment Webhook
1. In Stripe Dashboard, navigate to **Developers -> Webhooks**.
2. Click **Add Endpoint**.
3. Set URL to `https://your-app-name.vercel.app/api/webhooks/stripe`.
4. Add Event: `checkout.session.completed`.
5. Copy the Signing Secret (`whsec_...`) and update `STRIPE_WEBHOOK_SECRET` in Vercel.

### Step 9: Trigger Production Deployment
Push to the `main` branch or trigger manual deployment in Vercel Dashboard. Vercel automatically runs `prisma generate && next build`.

### Step 10: Test Production Application
1. Verify home page renders interactive MacBook display.
2. Log into `/login` with Admin credentials.
3. Test slot inspection and checkout flow.
4. Verify webhook processes payments into `PENDING_REVIEW` state.

---

## Troubleshooting Deployment Failures

### 1. Database Connection Timeout / Prisma Engine Errors
- **Symptom**: `PrismaClientInitializationError: Can't reach database server`.
- **Fix**: Ensure connection string includes connection pooling parameters (e.g. `?sslmode=require&pgbouncer=true`). Verify IP restriction whitelist in Neon/Supabase allows connections from Vercel IPs.

### 2. Stripe Webhook Signature Failure
- **Symptom**: `400 Webhook Error: No signature found`.
- **Fix**: Verify `STRIPE_WEBHOOK_SECRET` matches the exact signing secret (`whsec_...`) from Stripe Dashboard. In Vercel, ensure the variable is enabled for Production.

### 3. Missing Auth Token / Cookie Blocked in Cross-Site Redirects
- **Symptom**: Admin logged out immediately upon page navigation.
- **Fix**: Ensure `NEXT_PUBLIC_APP_URL` uses `https://` protocol and matches domain exactly. Cookie flags set `SameSite=Lax` and `Secure=true` in production.
