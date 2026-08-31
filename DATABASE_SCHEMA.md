# DATABASE SCHEMA — RENT-A-MAC

## 1. Relational Entity Overview
The database uses Prisma ORM to manage relational entities for Users, Advertising Slots, Advertisements, Rentals, Payments, and Admin Audit Actions.

---

## 2. Schema Definition (Prisma)

```prisma
datasource db {
  provider = "sqlite" // Configurable to "postgresql" for production
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
}

enum SlotStatus {
  AVAILABLE
  PENDING
  RESERVED
  OCCUPIED
  DISABLED
}

enum RentalStatus {
  PENDING_PAYMENT
  PENDING_REVIEW
  ACTIVE
  REJECTED
  EXPIRED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

model User {
  id            String      @id @default(uuid())
  email         String      @unique
  passwordHash  String
  name          String
  company       String?
  role          Role        @default(USER)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  rentals       Rental[]
  adminActions  AdminAction[]

  @@map("users")
}

model AdvertisingSlot {
  id             String         @id @default(uuid())
  name           String
  slug           String         @unique
  description    String
  position       String         // e.g. "center-top", "notch-right", "dock-center"
  gridArea       String         // CSS grid or absolute coordinate binding
  width          Int            // Width in px or %
  height         Int            // Height in px or %
  basePrice7Days Float          // Base price for 7 days in USD
  status         SlotStatus     @default(AVAILABLE)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  rentals        Rental[]

  @@map("advertising_slots")
}

model Advertisement {
  id           String      @id @default(uuid())
  title        String
  brandName    String
  targetUrl    String
  imageUrl     String      // Uploaded banner/logo asset URL
  altText      String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  rentals      Rental[]

  @@map("advertisements")
}

model Rental {
  id              String        @id @default(uuid())
  userEmail       String
  userName        String
  companyName     String?
  slotId          String
  slot            AdvertisingSlot @relation(fields: [slotId], references: [id])
  advertisementId String
  advertisement   Advertisement @relation(fields: [advertisementId], references: [id])
  userId          String?
  user            User?          @relation(fields: [userId], references: [id])
  
  durationDays    Int
  startDate       DateTime
  endDate         DateTime
  totalAmount     Float
  
  status          RentalStatus   @default(PENDING_PAYMENT)
  rejectionReason String?
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  payment         Payment?

  @@index([slotId, startDate, endDate])
  @@index([status])
  @@map("rentals")
}

model Payment {
  id              String        @id @default(uuid())
  rentalId        String        @unique
  rental          Rental        @relation(fields: [rentalId], references: [id], onDelete: Cascade)
  stripeSessionId String?       @unique
  stripePaymentIntentId String? @unique
  amount          Float
  currency        String        @default("usd")
  status          PaymentStatus @default(PENDING)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@map("payments")
}

model AdminAction {
  id        String   @id @default(uuid())
  adminId   String
  admin     User     @relation(fields: [adminId], references: [id])
  action    String   // e.g., "APPROVE_RENTAL", "REJECT_RENTAL", "DISABLE_SLOT"
  targetId  String
  details   String?
  createdAt DateTime @default(now())

  @@map("admin_actions")
}
```

---

## 3. Database Indexes & Constraints
- `User.email`: Unique constraint.
- `AdvertisingSlot.slug`: Unique constraint.
- `Rental`: Composite index on `[slotId, startDate, endDate]` for fast availability overlap checks.
- `Payment.stripeSessionId` & `stripePaymentIntentId`: Unique constraints for webhook idempotency lookup.
