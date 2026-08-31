export type SlotStatusType = 'AVAILABLE' | 'PENDING' | 'RESERVED' | 'OCCUPIED' | 'DISABLED';

export type RentalStatusType = 
  | 'PENDING_PAYMENT' 
  | 'PENDING_REVIEW' 
  | 'ACTIVE' 
  | 'REJECTED' 
  | 'EXPIRED' 
  | 'CANCELLED';

export type PaymentStatusType = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type UserRole = 'USER' | 'ADMIN';

export interface AdvertisingSlotData {
  id: string;
  name: string;
  slug: string;
  description: string;
  position: string;
  gridArea: string;
  width: number;
  height: number;
  basePrice7Days: number;
  status: SlotStatusType;
  activeAd?: {
    brandName: string;
    targetUrl: string;
    imageUrl: string;
    title: string;
    endDate: string;
  } | null;
}

export interface PricingBreakdown {
  slotId: string;
  durationDays: number;
  basePrice7Days: number;
  discountPercentage: number;
  discountAmount: number;
  subtotal: number;
  finalPrice: number;
  pricePerDay: number;
}
