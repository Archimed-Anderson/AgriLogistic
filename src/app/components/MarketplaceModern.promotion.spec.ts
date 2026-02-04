import { describe, it, expect } from 'vitest';
import { isPromotionActive, computePromotionPrice } from './MarketplaceModern';

describe('MarketplaceModern promotions helpers', () => {
  describe('isPromotionActive', () => {
    it('returns false when promotion is undefined or has no value', () => {
      const now = new Date('2024-01-10T12:00:00Z');
      expect(isPromotionActive(undefined, now)).toBe(false);
      expect(
        isPromotionActive(
          {
            type: 'percentage',
            value: 0,
          },
          now
        )
      ).toBe(false);
    });

    it('respects start and end dates', () => {
      const now = new Date('2024-01-10T12:00:00Z');
      const base = {
        type: 'percentage' as const,
        value: 10,
      };

      expect(
        isPromotionActive(
          {
            ...base,
            startsAt: '2024-01-11T00:00:00Z',
          },
          now
        )
      ).toBe(false);

      expect(
        isPromotionActive(
          {
            ...base,
            startsAt: '2024-01-09T00:00:00Z',
            endsAt: '2024-01-09T23:59:59Z',
          },
          now
        )
      ).toBe(false);

      expect(
        isPromotionActive(
          {
            ...base,
            startsAt: '2024-01-09T00:00:00Z',
            endsAt: '2024-01-11T00:00:00Z',
          },
          now
        )
      ).toBe(true);
    });
  });

  describe('computePromotionPrice', () => {
    it('returns null when promotion is not active', () => {
      const now = new Date('2024-01-10T12:00:00Z');
      const result = computePromotionPrice(
        100,
        {
          type: 'percentage',
          value: 0,
        },
        now
      );
      expect(result).toBeNull();
    });

    it('applies percentage discount correctly', () => {
      const now = new Date('2024-01-10T12:00:00Z');
      const result = computePromotionPrice(
        100,
        {
          type: 'percentage',
          value: 20,
          startsAt: '2024-01-01T00:00:00Z',
          endsAt: '2024-02-01T00:00:00Z',
        },
        now
      );
      expect(result).not.toBeNull();
      expect(result!.discountedPrice).toBeCloseTo(80);
      expect(result!.savingsPercentage).toBeCloseTo(20);
    });

    it('applies fixed discount correctly and never goes below zero', () => {
      const now = new Date('2024-01-10T12:00:00Z');
      const result = computePromotionPrice(
        50,
        {
          type: 'fixed',
          value: 10,
          startsAt: '2024-01-01T00:00:00Z',
          endsAt: '2024-02-01T00:00:00Z',
        },
        now
      );
      expect(result).not.toBeNull();
      expect(result!.discountedPrice).toBeCloseTo(40);
      expect(result!.savingsPercentage).toBeCloseTo(20);

      const zeroResult = computePromotionPrice(
        5,
        {
          type: 'fixed',
          value: 10,
          startsAt: '2024-01-01T00:00:00Z',
          endsAt: '2024-02-01T00:00:00Z',
        },
        now
      );
      expect(zeroResult).not.toBeNull();
      expect(zeroResult!.discountedPrice).toBe(0);
    });
  });
});
