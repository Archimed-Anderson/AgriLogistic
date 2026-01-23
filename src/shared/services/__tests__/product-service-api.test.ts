import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('product-service-api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should use VITE_API_GATEWAY_URL when provided', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { products: [], total: 0, pages: 0 } }),
    });
    (globalThis as any).fetch = mockFetch;

    // Ensure module reads env at import time
    process.env.VITE_API_GATEWAY_URL = 'http://example.test/api/v1';
    vi.resetModules();

    const { productServiceApi } = await import('../product-service-api');
    await productServiceApi.getProducts();

    const calledUrl = String(mockFetch.mock.calls[0]?.[0]);
    expect(calledUrl.startsWith('http://example.test/api/v1/products')).toBe(true);
  });
});

