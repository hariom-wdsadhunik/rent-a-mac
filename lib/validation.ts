import { z } from 'zod';

export const checkoutSchema = z.object({
  slotId: z.string().min(1, 'Slot selection is required'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid start date is required',
  }),
  durationDays: z.coerce.number().refine((val) => [7, 30, 90].includes(val), {
    message: 'Duration must be 7, 30, or 90 days',
  }),
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  userEmail: z.string().email('Valid email address is required'),
  companyName: z.string().optional(),
  adTitle: z.string().min(2, 'Advertisement title must be at least 2 characters'),
  brandName: z.string().min(2, 'Brand name must be at least 2 characters'),
  targetUrl: z.string().url('Must be a valid URL starting with http:// or https://'),
  imageUrl: z.string().min(1, 'Advertisement image or logo is required'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const slotSchema = z.object({
  name: z.string().min(2, 'Slot name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(5, 'Description is required'),
  position: z.string().min(2, 'Position is required'),
  gridArea: z.string().min(2, 'Grid area key is required'),
  width: z.coerce.number().positive(),
  height: z.coerce.number().positive(),
  basePrice7Days: z.coerce.number().positive(),
  status: z.enum(['AVAILABLE', 'PENDING', 'RESERVED', 'OCCUPIED', 'DISABLED']),
});

export type SlotInput = z.infer<typeof slotSchema>;
