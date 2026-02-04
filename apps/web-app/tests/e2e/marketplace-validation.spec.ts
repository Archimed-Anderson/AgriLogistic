import { test, expect } from '@playwright/test';

test.describe('AgroMarket Marketplace Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace');
  });

  test('should display the marketplace header and products', async ({ page }) => {
    await expect(page.getByText(/Le Marché Vivant/i)).toBeVisible({ timeout: 15000 });
    const productCards = page.getByTestId('product-card');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);
    const count = await productCards.count();
    expect(count).toBeGreaterThan(40);
  });

  test('should filter products by category', async ({ page }) => {
    const fruitsPill = page.getByTestId('category-Fruits');
    await fruitsPill.click();
    const productCards = page.getByTestId('product-card');
    await expect(productCards).toHaveCount(15, { timeout: 10000 });
    await expect(page.getByText('Mangue Kent')).toBeVisible();
  });

  test('should search for a product', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('Ananas');
    await expect(page.getByText('Ananas Pain de Sucre')).toBeVisible();
  });

  test('should add a product card to cart', async ({ page }) => {
    const firstCard = page.getByTestId('product-card').first();
    const addButton = firstCard.locator('button:has(.lucide-plus)');
    await addButton.click();
    const cartBadge = page.locator('nav').locator('span:has-text("1")');
    await expect(cartBadge).toBeVisible();
  });

  test('should manage full cart and checkout flow', async ({ page }) => {
    // 1. Add item
    const firstCard = page.getByTestId('product-card').first();
    await firstCard.locator('button:has(.lucide-plus)').click();

    // 2. Wait for badge to ensure it's in state/localStorage
    const cartBadge = page.locator('nav').locator('span:has-text("1")');
    await expect(cartBadge).toBeVisible();

    // 3. Go to cart
    await page.goto('/marketplace/cart');

    // 4. Ensure cart is NOT empty (wait for cart-item)
    const cartItems = page.getByTestId('cart-item');
    await expect(cartItems.first()).toBeVisible({ timeout: 10000 });

    // 5. Increase quantity
    const plusButton = page.getByTestId('cart-plus').first();
    await plusButton.click();

    // 6. Expect 2 items in quantity span or badge
    await expect(page.getByText(/2 articles/i)).toBeVisible();

    // 7. Checkout
    await page.getByRole('button', { name: /Passer la commande/i }).click();
    await expect(page).toHaveURL(/\/checkout-mockup/);

    // 8. Success
    await expect(page.getByText(/Commande Confirmée/i)).toBeVisible({ timeout: 15000 });
  });
});
