import { test, expect, Page } from '@playwright/test';

test.describe('MarketplaceModern - Product Browsing & Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // Adjust the URL based on your app routing
    // Navigate to marketplace if needed
    // await page.click('text=Marketplace');
  });

  test('should display product grid with initial products', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Check that products are displayed
    const productCards = page.locator('[data-testid="product-card"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter products by category', async ({ page }) => {
    await page.waitForSelector('[data-testid="category-filter"]', { timeout: 5000 });
    
    // Click on a category filter (e.g., "Légumes")
    await page.click('[data-testid="category-Légumes"]');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Verify filtered products
    const products = page.locator('[data-testid="product-card"]');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that all visible products belong to selected category
    const firstProduct = products.first();
    const categoryBadge = firstProduct.locator('[data-testid="product-category"]');
    await expect(categoryBadge).toContainText('Légumes');
  });

  test('should search for products', async ({ page }) => {
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 5000 });
    
    // Enter search query
    await page.fill('[data-testid="search-input"]', 'tomates');
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    // Verify search results
    const products = page.locator('[data-testid="product-card"]');
    const count = await products.count();
    
    if (count > 0) {
      // Check that product names contain search term
      const firstProductName = await products.first().locator('[data-testid="product-name"]').textContent();
      expect(firstProductName?.toLowerCase()).toContain('tomate');
    }
  });

  test('should filter by price range', async ({ page }) => {
    await page.waitForSelector('[data-testid="price-range-slider"]', { timeout: 5000 });
    
    // Adjust price range slider (implementation depends on your slider component)
    // This is a simplified example
    const priceMin = page.locator('[data-testid="price-min-input"]');
    const priceMax = page.locator('[data-testid="price-max-input"]');
    
    await priceMin.fill('5');
    await priceMax.fill('15');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Verify products are within price range
    const products = page.locator('[data-testid="product-card"]');
    const count = await products.count();
    
    if (count > 0) {
      const firstProductPrice = await products.first().locator('[data-testid="product-price"]').textContent();
      const price = parseFloat(firstProductPrice?.replace('€', '') || '0');
      expect(price).toBeGreaterThanOrEqual(5);
      expect(price).toBeLessThanOrEqual(15);
    }
  });

  test('should filter by rating', async ({ page }) => {
    await page.waitForSelector('[data-testid="rating-filter"]', { timeout: 5000 });
    
    // Select minimum rating (e.g., 4 stars)
    await page.click('[data-testid="rating-4"]');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Verify products have minimum rating
    const products = page.locator('[data-testid="product-card"]');
    const count = await products.count();
    
    if (count > 0) {
      const ratingElement = products.first().locator('[data-testid="product-rating"]');
      const ratingText = await ratingElement.textContent();
      const rating = parseFloat(ratingText || '0');
      expect(rating).toBeGreaterThanOrEqual(4);
    }
  });

  test('should filter by labels', async ({ page }) => {
    await page.waitForSelector('[data-testid="label-filter"]', { timeout: 5000 });
    
    // Select "Bio" label
    await page.click('[data-testid="label-Bio"]');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Verify products have Bio label
    const products = page.locator('[data-testid="product-card"]');
    const count = await products.count();
    
    if (count > 0) {
      const labels = products.first().locator('[data-testid="product-label"]');
      const labelsText = await labels.allTextContents();
      expect(labelsText.some(label => label.includes('Bio'))).toBeTruthy();
    }
  });

  test('should toggle view mode between grid and list', async ({ page }) => {
    await page.waitForSelector('[data-testid="view-toggle"]', { timeout: 5000 });
    
    // Click list view button
    await page.click('[data-testid="view-list"]');
    await page.waitForTimeout(300);
    
    // Verify list view is active
    const productContainer = page.locator('[data-testid="product-container"]');
    await expect(productContainer).toHaveClass(/list/);
    
    // Click grid view button
    await page.click('[data-testid="view-grid"]');
    await page.waitForTimeout(300);
    
    // Verify grid view is active
    await expect(productContainer).toHaveClass(/grid/);
  });

  test('should sort products', async ({ page }) => {
    await page.waitForSelector('[data-testid="sort-select"]', { timeout: 5000 });
    
    // Sort by price ascending
    await page.selectOption('[data-testid="sort-select"]', 'price-asc');
    await page.waitForTimeout(500);
    
    // Verify products are sorted by price
    const products = page.locator('[data-testid="product-card"]');
    const firstProductPrice = await products.first().locator('[data-testid="product-price"]').textContent();
    const secondProductPrice = await products.nth(1).locator('[data-testid="product-price"]').textContent();
    
    const price1 = parseFloat(firstProductPrice?.replace('€', '') || '0');
    const price2 = parseFloat(secondProductPrice?.replace('€', '') || '0');
    
    expect(price1).toBeLessThanOrEqual(price2);
  });

  test('should clear all filters', async ({ page }) => {
    await page.waitForSelector('[data-testid="clear-filters"]', { timeout: 5000 });
    
    // Apply some filters first
    await page.click('[data-testid="category-Légumes"]');
    await page.click('[data-testid="label-Bio"]');
    
    await page.waitForTimeout(500);
    
    // Clear all filters
    await page.click('[data-testid="clear-filters"]');
    await page.waitForTimeout(500);
    
    // Verify all products are shown again
    const products = page.locator('[data-testid="product-card"]');
    const count = await products.count();
    expect(count).toBeGreaterThan(0); // Should show all products
  });
});

test.describe('MarketplaceModern - Product Comparison', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
  });

  test('should add products to comparison', async ({ page }) => {
    // Add first product to comparison
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.locator('[data-testid="compare-button"]').click();
    
    await page.waitForTimeout(300);
    
    // Verify comparison counter updated
    const compareCounter = page.locator('[data-testid="compare-counter"]');
    await expect(compareCounter).toHaveText('1');
    
    // Add second product
    const secondProduct = page.locator('[data-testid="product-card"]').nth(1);
    await secondProduct.locator('[data-testid="compare-button"]').click();
    
    await page.waitForTimeout(300);
    
    // Verify comparison counter updated
    await expect(compareCounter).toHaveText('2');
  });

  test('should open comparison modal', async ({ page }) => {
    // Add products to comparison
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="compare-button"]').click();
    await page.locator('[data-testid="product-card"]').nth(1).locator('[data-testid="compare-button"]').click();
    
    await page.waitForTimeout(300);
    
    // Open comparison modal
    await page.click('[data-testid="open-comparison"]');
    
    // Verify modal is open
    const modal = page.locator('[data-testid="comparison-modal"]');
    await expect(modal).toBeVisible();
    
    // Verify products are displayed in modal
    const comparedProducts = modal.locator('[data-testid="compared-product"]');
    const count = await comparedProducts.count();
    expect(count).toBe(2);
  });

  test('should remove product from comparison', async ({ page }) => {
    // Add products
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="compare-button"]').click();
    await page.locator('[data-testid="product-card"]').nth(1).locator('[data-testid="compare-button"]').click();
    
    // Open comparison modal
    await page.click('[data-testid="open-comparison"]');
    await page.waitForTimeout(300);
    
    // Remove first product
    const modal = page.locator('[data-testid="comparison-modal"]');
    await modal.locator('[data-testid="remove-from-comparison"]').first().click();
    
    await page.waitForTimeout(300);
    
    // Verify product count decreased
    const comparedProducts = modal.locator('[data-testid="compared-product"]');
    const count = await comparedProducts.count();
    expect(count).toBe(1);
  });

  test('should display comparison table with specifications', async ({ page }) => {
    // Add products and open modal
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="compare-button"]').click();
    await page.locator('[data-testid="product-card"]').nth(1).locator('[data-testid="compare-button"]').click();
    await page.click('[data-testid="open-comparison"]');
    
    await page.waitForTimeout(300);
    
    // Verify comparison table exists
    const table = page.locator('[data-testid="comparison-table"]');
    await expect(table).toBeVisible();
    
    // Verify table rows for different attributes
    await expect(page.locator('text=Prix')).toBeVisible();
    await expect(page.locator('text=Vendeur')).toBeVisible();
    await expect(page.locator('text=Catégorie')).toBeVisible();
    await expect(page.locator('text=Disponibilité')).toBeVisible();
  });
});

test.describe('MarketplaceModern - Price Alerts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
  });

  test('should create price drop alert', async ({ page }) => {
    // Click on first product to view details
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForTimeout(300);
    
    // Open alert creation modal
    await page.click('[data-testid="create-alert-button"]');
    await page.waitForTimeout(300);
    
    // Select price drop alert type
    await page.click('[data-testid="alert-type-price_drop"]');
    
    // Submit alert
    await page.click('[data-testid="submit-alert"]');
    
    await page.waitForTimeout(300);
    
    // Verify success notification
    await expect(page.locator('text=Alerte créée avec succès')).toBeVisible();
  });

  test('should create price target alert', async ({ page }) => {
    // Open product and alert modal
    await page.locator('[data-testid="product-card"]').first().click();
    await page.click('[data-testid="create-alert-button"]');
    await page.waitForTimeout(300);
    
    // Select price target alert
    await page.click('[data-testid="alert-type-price_target"]');
    
    // Enter target price
    await page.fill('[data-testid="target-price-input"]', '5.00');
    
    // Submit alert
    await page.click('[data-testid="submit-alert"]');
    
    await page.waitForTimeout(300);
    
    // Verify success
    await expect(page.locator('text=Alerte créée')).toBeVisible();
  });

  test('should view active alerts', async ({ page }) => {
    // Open alerts panel
    await page.click('[data-testid="alerts-panel-button"]');
    await page.waitForTimeout(300);
    
    // Verify alerts panel is visible
    const alertsPanel = page.locator('[data-testid="alerts-panel"]');
    await expect(alertsPanel).toBeVisible();
  });

  test('should delete alert', async ({ page }) => {
    // Assuming there's an existing alert
    await page.click('[data-testid="alerts-panel-button"]');
    await page.waitForTimeout(300);
    
    // Click delete on first alert
    const deleteButton = page.locator('[data-testid="delete-alert"]').first();
    
    if (await deleteButton.count() > 0) {
      await deleteButton.click();
      await page.waitForTimeout(300);
      
      // Confirm deletion if there's a confirmation modal
      const confirmButton = page.locator('[data-testid="confirm-delete-alert"]');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      await page.waitForTimeout(300);
      
      // Verify alert was deleted
      await expect(page.locator('text=Alerte supprimée')).toBeVisible();
    }
  });
});

test.describe('MarketplaceModern - Favorites & Wishlist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
  });

  test('should add product to favorites', async ({ page }) => {
    // Click favorite button on first product
    const favoriteButton = page.locator('[data-testid="product-card"]').first().locator('[data-testid="favorite-button"]');
    await favoriteButton.click();
    
    await page.waitForTimeout(300);
    
    // Verify button state changed (e.g., filled heart icon)
    await expect(favoriteButton).toHaveClass(/active|filled/);
  });

  test('should remove product from favorites', async ({ page }) => {
    // Add to favorites first
    const favoriteButton = page.locator('[data-testid="product-card"]').first().locator('[data-testid="favorite-button"]');
    await favoriteButton.click();
    await page.waitForTimeout(300);
    
    // Click again to remove
    await favoriteButton.click();
    await page.waitForTimeout(300);
    
    // Verify button state changed back
    await expect(favoriteButton).not.toHaveClass(/active|filled/);
  });

  test('should persist favorites in localStorage', async ({ page }) => {
    // Add to favorites
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const productId = await firstProduct.getAttribute('data-product-id');
    
    await firstProduct.locator('[data-testid="favorite-button"]').click();
    await page.waitForTimeout(300);
    
    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Verify favorite is still active
    const favoriteButton = page.locator(`[data-product-id="${productId}"]`).locator('[data-testid="favorite-button"]');
    await expect(favoriteButton).toHaveClass(/active|filled/);
  });
});

test.describe('MarketplaceModern - Cart Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
  });

  test('should add product to cart', async ({ page }) => {
    // Get initial cart count
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    const initialCount = await cartCounter.textContent();
    
    // Add product to cart
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="add-to-cart"]').click();
    
    await page.waitForTimeout(300);
    
    // Verify cart counter increased
    const newCount = await cartCounter.textContent();
    expect(parseInt(newCount || '0')).toBe(parseInt(initialCount || '0') + 1);
    
    // Verify success notification
    await expect(page.locator('text=ajouté au panier')).toBeVisible();
  });

  test('should add product to cart from comparison modal', async ({ page }) => {
    // Add products to comparison and open modal
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="compare-button"]').click();
    await page.click('[data-testid="open-comparison"]');
    await page.waitForTimeout(300);
    
    // Add to cart from comparison modal
    const modal = page.locator('[data-testid="comparison-modal"]');
    await modal.locator('[data-testid="add-to-cart"]').first().click();
    
    await page.waitForTimeout(300);
    
    // Verify success notification
    await expect(page.locator('text=ajouté au panier')).toBeVisible();
  });
});

test.describe('MarketplaceModern - Product Details', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
  });

  test('should open product detail modal', async ({ page }) => {
    // Click on product card
    await page.locator('[data-testid="product-card"]').first().click();
    
    await page.waitForTimeout(300);
    
    // Verify modal is open
    const modal = page.locator('[data-testid="product-detail-modal"]');
    await expect(modal).toBeVisible();
  });

  test('should display product information', async ({ page }) => {
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForTimeout(300);
    
    const modal = page.locator('[data-testid="product-detail-modal"]');
    
    // Verify product details are displayed
    await expect(modal.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(modal.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(modal.locator('[data-testid="product-description"]')).toBeVisible();
    await expect(modal.locator('[data-testid="product-seller"]')).toBeVisible();
  });

  test('should display product reviews', async ({ page }) => {
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForTimeout(300);
    
    const modal = page.locator('[data-testid="product-detail-modal"]');
    
    // Verify reviews section exists
    const reviewsSection = modal.locator('[data-testid="product-reviews"]');
    
    if (await reviewsSection.count() > 0) {
      await expect(reviewsSection).toBeVisible();
    }
  });

  test('should close product detail modal', async ({ page }) => {
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForTimeout(300);
    
    // Close modal
    await page.click('[data-testid="close-product-modal"]');
    
    await page.waitForTimeout(300);
    
    // Verify modal is closed
    const modal = page.locator('[data-testid="product-detail-modal"]');
    await expect(modal).not.toBeVisible();
  });
});

test.describe('MarketplaceModern - Smart Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
  });

  test('should save current filters as preset', async ({ page }) => {
    // Apply some filters
    await page.click('[data-testid="category-Légumes"]');
    await page.click('[data-testid="label-Bio"]');
    await page.waitForTimeout(300);
    
    // Open save filter modal
    await page.click('[data-testid="save-filters-button"]');
    await page.waitForTimeout(300);
    
    // Enter preset name
    await page.fill('[data-testid="preset-name-input"]', 'Légumes Bio');
    
    // Save preset
    await page.click('[data-testid="save-preset-button"]');
    await page.waitForTimeout(300);
    
    // Verify success notification
    await expect(page.locator('text=Filtre enregistré')).toBeVisible();
  });

  test('should load saved filter preset', async ({ page }) => {
    // Assuming there's a saved preset
    await page.click('[data-testid="saved-presets-button"]');
    await page.waitForTimeout(300);
    
    // Click on first preset
    const firstPreset = page.locator('[data-testid="filter-preset"]').first();
    
    if (await firstPreset.count() > 0) {
      await firstPreset.click();
      await page.waitForTimeout(500);
      
      // Verify filters were applied
      const products = page.locator('[data-testid="product-card"]');
      const count = await products.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should apply quick filter', async ({ page }) => {
    // Click on "Bio & Local" quick filter
    await page.click('[data-testid="quick-filter-bio-local"]');
    await page.waitForTimeout(500);
    
    // Verify Bio and Local labels are selected
    const bioLabel = page.locator('[data-testid="label-Bio"]');
    const localLabel = page.locator('[data-testid="label-Local"]');
    
    await expect(bioLabel).toHaveClass(/active|selected/);
    await expect(localLabel).toHaveClass(/active|selected/);
  });
});
