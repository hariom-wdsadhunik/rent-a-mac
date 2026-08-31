import test from 'node:test';
import assert from 'node:assert';
import { calculateRentalPrice } from '../lib/pricing';

test('Server Pricing Calculation - 7 Days Base Rate', () => {
  const basePrice = 100;
  const pricing = calculateRentalPrice(basePrice, 7);

  assert.strictEqual(pricing.durationDays, 7);
  assert.strictEqual(pricing.discountPercentage, 0);
  assert.strictEqual(pricing.discountAmount, 0);
  assert.strictEqual(pricing.finalPrice, 100);
});

test('Server Pricing Calculation - 30 Days 15% Discount', () => {
  const basePrice = 70; // $10/day raw
  const pricing = calculateRentalPrice(basePrice, 30);

  // Subtotal = 300
  // Discount = 15% of 300 = 45
  // Final = 255
  assert.strictEqual(pricing.subtotal, 300);
  assert.strictEqual(pricing.discountPercentage, 15);
  assert.strictEqual(pricing.discountAmount, 45);
  assert.strictEqual(pricing.finalPrice, 255);
});

test('Server Pricing Calculation - 90 Days 30% Discount', () => {
  const basePrice = 70; // $10/day raw
  const pricing = calculateRentalPrice(basePrice, 90);

  // Subtotal = 900
  // Discount = 30% of 900 = 270
  // Final = 630
  assert.strictEqual(pricing.subtotal, 900);
  assert.strictEqual(pricing.discountPercentage, 30);
  assert.strictEqual(pricing.discountAmount, 270);
  assert.strictEqual(pricing.finalPrice, 630);
});

test('Server Pricing Calculation - Invalid Input Validation', () => {
  assert.throws(() => {
    calculateRentalPrice(0, 7);
  }, /Invalid pricing parameters/);

  assert.throws(() => {
    calculateRentalPrice(100, 0);
  }, /Invalid pricing parameters/);
});
