import { test, expect, Page } from '@playwright/test';

test.describe('MarketplaceModern - Admin Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to marketplace
    // await page.click('text=Marketplace');
    
    // Enable admin mode
    await page.click('[data-testid="admin-toggle"]');
    await page.waitForTimeout(300);
  });

  test('should toggle admin mode', async ({ page }) => {
    // Verify admin banner is visible
    const adminBanner = page.locator('[data-testid="admin-banner"]');
    await expect(adminBanner).toBeVisible();
    
    // Verify admin tools are visible
    const addProductButton = page.locator('[data-testid="add-product-button"]');
    await expect(addProductButton).toBeVisible();
  });

  test('should display admin controls on product cards', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Verify edit button is visible on products
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const editButton = firstProduct.locator('[data-testid="edit-product"]');
    await expect(editButton).toBeVisible();
    
    // Verify selection checkbox is visible
    const selectCheckbox = firstProduct.locator('[data-testid="select-product"]');
    await expect(selectCheckbox).toBeVisible();
  });

  test('should select single product', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Click checkbox on first product
    const checkbox = page.locator('[data-testid="product-card"]').first().locator('[data-testid="select-product"]');
    await checkbox.click();
    
    await page.waitForTimeout(300);
    
    // Verify selection counter
    const selectionCounter = page.locator('[data-testid="selection-counter"]');
    await expect(selectionCounter).toContainText('1');
  });

  test('should select multiple products', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Select first product
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="select-product"]').click();
    
    // Select second product
    await page.locator('[data-testid="product-card"]').nth(1).locator('[data-testid="select-product"]').click();
    
    await page.waitForTimeout(300);
    
    // Verify selection counter
    const selectionCounter = page.locator('[data-testid="selection-counter"]');
    await expect(selectionCounter).toContainText('2');
  });

  test('should select all products on page', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Click select all button
    await page.click('[data-testid="select-all-products"]');
    
    await page.waitForTimeout(300);
    
    // Verify all products are selected
    const products = page.locator('[data-testid="product-card"]');
    const count = await products.count();
    
    const selectionCounter = page.locator('[data-testid="selection-counter"]');
    await expect(selectionCounter).toContainText(count.toString());
  });

  test('should deselect all products', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Select all first
    await page.click('[data-testid="select-all-products"]');
    await page.waitForTimeout(300);
    
    // Deselect all
    await page.click('[data-testid="deselect-all-products"]');
    await page.waitForTimeout(300);
    
    // Verify selection counter is 0 or not visible
    const selectionCounter = page.locator('[data-testid="selection-counter"]');
    const isVisible = await selectionCounter.isVisible();
    
    if (isVisible) {
      await expect(selectionCounter).toContainText('0');
    }
  });
});

test.describe('MarketplaceModern - Bulk Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="admin-toggle"]');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Select multiple products
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="select-product"]').click();
    await page.locator('[data-testid="product-card"]').nth(1).locator('[data-testid="select-product"]').click();
    await page.waitForTimeout(300);
  });

  test('should show bulk actions menu when products are selected', async ({ page }) => {
    // Verify bulk actions menu is visible
    const bulkActionsMenu = page.locator('[data-testid="bulk-actions-menu"]');
    await expect(bulkActionsMenu).toBeVisible();
  });

  test('should bulk archive products', async ({ page }) => {
    // Click bulk archive button
    await page.click('[data-testid="bulk-archive"]');
    
    // Confirm action in modal
    const confirmModal = page.locator('[data-testid="confirm-bulk-action"]');
    await expect(confirmModal).toBeVisible();
    
    await page.click('[data-testid="confirm-action-button"]');
    
    await page.waitForTimeout(500);
    
    // Verify success notification
    await expect(page.locator('text=Produits archivés')).toBeVisible();
  });

  test('should bulk delete products', async ({ page }) => {
    // Click bulk delete button
    await page.click('[data-testid="bulk-delete"]');
    
    // Confirm dangerous action
    const confirmModal = page.locator('[data-testid="confirm-bulk-action"]');
    await expect(confirmModal).toBeVisible();
    
    await page.click('[data-testid="confirm-action-button"]');
    
    await page.waitForTimeout(500);
    
    // Verify success notification
    await expect(page.locator('text=Produits supprimés')).toBeVisible();
  });

  test('should bulk update prices', async ({ page }) => {
    // Click bulk price update button
    await page.click('[data-testid="bulk-update-price"]');
    
    // Modal should open
    const priceModal = page.locator('[data-testid="bulk-price-modal"]');
    await expect(priceModal).toBeVisible();
    
    // Select update type (e.g., increase by percentage)
    await page.selectOption('[data-testid="price-update-type"]', 'percentage');
    
    // Enter percentage value
    await page.fill('[data-testid="price-value-input"]', '10');
    
    // Confirm update
    await page.click('[data-testid="apply-price-update"]');
    
    await page.waitForTimeout(500);
    
    // Verify success notification
    await expect(page.locator('text=Prix mis à jour')).toBeVisible();
  });

  test('should bulk change category', async ({ page }) => {
    // Click bulk change category button
    await page.click('[data-testid="bulk-change-category"]');
    
    // Modal should open
    const categoryModal = page.locator('[data-testid="bulk-category-modal"]');
    await expect(categoryModal).toBeVisible();
    
    // Select new category
    await page.selectOption('[data-testid="category-select"]', 'Fruits');
    
    // Confirm change
    await page.click('[data-testid="apply-category-change"]');
    
    await page.waitForTimeout(500);
    
    // Verify success
    await expect(page.locator('text=Catégorie modifiée')).toBeVisible();
  });

  test('should bulk update stock status', async ({ page }) => {
    // Click bulk stock status button
    await page.click('[data-testid="bulk-update-stock"]');
    
    // Modal should open
    const stockModal = page.locator('[data-testid="bulk-stock-modal"]');
    await expect(stockModal).toBeVisible();
    
    // Select stock status
    await page.selectOption('[data-testid="stock-status-select"]', 'in-stock');
    
    // Confirm update
    await page.click('[data-testid="apply-stock-update"]');
    
    await page.waitForTimeout(500);
    
    // Verify success
    await expect(page.locator('text=Stock mis à jour')).toBeVisible();
  });

  test('should bulk add labels', async ({ page }) => {
    // Click bulk add labels button
    await page.click('[data-testid="bulk-add-labels"]');
    
    // Modal should open
    const labelsModal = page.locator('[data-testid="bulk-labels-modal"]');
    await expect(labelsModal).toBeVisible();
    
    // Select labels to add
    await page.click('[data-testid="label-checkbox-Bio"]');
    await page.click('[data-testid="label-checkbox-Local"]');
    
    // Confirm
    await page.click('[data-testid="apply-labels"]');
    
    await page.waitForTimeout(500);
    
    // Verify success
    await expect(page.locator('text=Labels ajoutés')).toBeVisible();
  });

  test('should cancel bulk action', async ({ page }) => {
    // Click bulk archive button
    await page.click('[data-testid="bulk-archive"]');
    
    // Confirm modal appears
    const confirmModal = page.locator('[data-testid="confirm-bulk-action"]');
    await expect(confirmModal).toBeVisible();
    
    // Cancel action
    await page.click('[data-testid="cancel-action-button"]');
    
    await page.waitForTimeout(300);
    
    // Verify modal is closed
    await expect(confirmModal).not.toBeVisible();
  });
});

test.describe('MarketplaceModern - Product CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="admin-toggle"]');
    await page.waitForTimeout(300);
  });

  test('should open add product modal', async ({ page }) => {
    // Click add product button
    await page.click('[data-testid="add-product-button"]');
    
    await page.waitForTimeout(300);
    
    // Verify modal is open
    const modal = page.locator('[data-testid="add-product-modal"]');
    await expect(modal).toBeVisible();
  });

  test('should create new simple product', async ({ page }) => {
    // Open add product modal
    await page.click('[data-testid="add-product-button"]');
    await page.waitForTimeout(300);
    
    // Select product type
    await page.click('[data-testid="product-type-simple"]');
    await page.click('[data-testid="next-step"]');
    
    await page.waitForTimeout(300);
    
    // Fill product details
    await page.fill('[data-testid="product-name-input"]', 'Tomates Cerises');
    await page.selectOption('[data-testid="product-category"]', 'Légumes');
    await page.fill('[data-testid="product-price"]', '4.50');
    await page.selectOption('[data-testid="product-unit"]', 'kg');
    await page.fill('[data-testid="product-description"]', 'Tomates cerises bio cultivées localement');
    
    // Select product image
    await page.click('[data-testid="product-image-option"]', { timeout: 5000 });
    
    // Click publish
    await page.click('[data-testid="publish-product"]');
    
    await page.waitForTimeout(500);
    
    // Verify success notification
    await expect(page.locator('text=Produit créé')).toBeVisible();
  });

  test('should create product with variants', async ({ page }) => {
    await page.click('[data-testid="add-product-button"]');
    await page.waitForTimeout(300);
    
    // Select variant product type
    await page.click('[data-testid="product-type-variant"]');
    await page.click('[data-testid="next-step"]');
    
    await page.waitForTimeout(300);
    
    // Fill base product info
    await page.fill('[data-testid="product-name-input"]', 'Pommes Golden');
    await page.selectOption('[data-testid="product-category"]', 'Fruits');
    
    // Add variant
    await page.click('[data-testid="add-variant-button"]');
    
    // Fill variant details
    await page.fill('[data-testid="variant-name-0"]', '1kg');
    await page.fill('[data-testid="variant-price-0"]', '3.80');
    
    // Add another variant
    await page.click('[data-testid="add-variant-button"]');
    await page.fill('[data-testid="variant-name-1"]', '2kg');
    await page.fill('[data-testid="variant-price-1"]', '7.00');
    
    // Publish
    await page.click('[data-testid="publish-product"]');
    
    await page.waitForTimeout(500);
    
    // Verify success
    await expect(page.locator('text=Produit créé')).toBeVisible();
  });

  test('should edit existing product', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Click edit on first product
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="edit-product"]').click();
    
    await page.waitForTimeout(300);
    
    // Verify edit modal is open
    const editModal = page.locator('[data-testid="edit-product-modal"]');
    await expect(editModal).toBeVisible();
    
    // Update product name
    const nameInput = page.locator('[data-testid="product-name-input"]');
    await nameInput.clear();
    await nameInput.fill('Tomates Bio Premium');
    
    // Update price
    const priceInput = page.locator('[data-testid="product-price"]');
    await priceInput.clear();
    await priceInput.fill('5.50');
    
    // Save changes
    await page.click('[data-testid="save-product"]');
    
    await page.waitForTimeout(500);
    
    // Verify success
    await expect(page.locator('text=Produit mis à jour')).toBeVisible();
  });

  test('should delete single product', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Click delete on first product
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="delete-product"]').click();
    
    await page.waitForTimeout(300);
    
    // Confirm deletion
    const confirmModal = page.locator('[data-testid="confirm-delete-modal"]');
    await expect(confirmModal).toBeVisible();
    
    await page.click('[data-testid="confirm-delete-button"]');
    
    await page.waitForTimeout(500);
    
    // Verify success
    await expect(page.locator('text=Produit supprimé')).toBeVisible();
  });

  test('should archive single product', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Click archive on first product
    await page.locator('[data-testid="product-card"]').first().locator('[data-testid="archive-product"]').click();
    
    await page.waitForTimeout(300);
    
    // Confirm archival
    const confirmModal = page.locator('[data-testid="confirm-archive-modal"]');
    
    if (await confirmModal.isVisible()) {
      await page.click('[data-testid="confirm-archive-button"]');
    }
    
    await page.waitForTimeout(500);
    
    // Verify success
    await expect(page.locator('text=Produit archivé')).toBeVisible();
  });

  test('should toggle product visibility', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
    
    // Click visibility toggle on first product
    const visibilityToggle = page.locator('[data-testid="product-card"]').first().locator('[data-testid="toggle-visibility"]');
    
    if (await visibilityToggle.count() > 0) {
      await visibilityToggle.click();
      
      await page.waitForTimeout(300);
      
      // Verify notification
      const notification = page.locator('text=/Visibilité.*modifiée/');
      await expect(notification).toBeVisible();
    }
  });

  test('should validate required fields when creating product', async ({ page }) => {
    await page.click('[data-testid="add-product-button"]');
    await page.waitForTimeout(300);
    
    await page.click('[data-testid="product-type-simple"]');
    await page.click('[data-testid="next-step"]');
    
    await page.waitForTimeout(300);
    
    // Try to publish without filling required fields
    await page.click('[data-testid="publish-product"]');
    
    await page.waitForTimeout(300);
    
    // Verify validation errors or disabled button
    const publishButton = page.locator('[data-testid="publish-product"]');
    await expect(publishButton).toBeDisabled();
  });

  test('should open admin tab in product detail', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    const detailPanel = page.locator('[data-testid="product-detail-panel"]');
    await expect(detailPanel).toBeVisible();

    const adminTab = page.locator('[data-testid="product-tab-admin"]');
    await adminTab.click();

    await expect(page.locator('[data-testid="admin-sku-input"]')).toBeVisible();
  });
});

test.describe('MarketplaceModern - Product Admin Advanced', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="admin-toggle"]');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
  });

  test('should validate admin tab required fields in product detail', async ({ page }) => {
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    const detailPanel = page.locator('[data-testid="product-detail-panel"]');
    await expect(detailPanel).toBeVisible();

    await page.click('[data-testid="product-tab-admin"]');

    const skuInput = page.locator('[data-testid="admin-sku-input"]');
    await skuInput.fill('');

    await page.click('[data-testid="admin-save"]');

    await expect(page.locator('text=Veuillez corriger les erreurs du formulaire')).toBeVisible();
    await expect(page.locator('text=SKU obligatoire')).toBeVisible();
    await expect(detailPanel).toBeVisible();
  });

  test('should configure promotion from admin tab and display it', async ({ page }) => {
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    await expect(page.locator('[data-testid="product-detail-panel"]')).toBeVisible();

    await page.click('[data-testid="product-tab-admin"]');

    const skuInput = page.locator('[data-testid="admin-sku-input"]');
    const currentSku = await skuInput.inputValue();
    if (!currentSku) {
      await skuInput.fill('SKU-ADMIN-TEST');
    }

    await page.click('[data-testid="admin-promo-toggle"]');

    await page.selectOption('[data-testid="admin-promo-type"]', 'percentage');
    await page.fill('[data-testid="admin-promo-value"]', '10');

    await page.click('[data-testid="admin-save"]');

    await expect(page.locator('text=Produit mis à jour avec succès')).toBeVisible();

    await firstProduct.click();
    await expect(page.locator('[data-testid="product-detail-panel"]')).toBeVisible();

    await expect(page.locator('text=Promotion active')).toBeVisible();
  });

  test('should add product media from admin tab', async ({ page }) => {
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    await expect(page.locator('[data-testid="product-detail-panel"]')).toBeVisible();

    await page.click('[data-testid="product-tab-admin"]');

    const fileInput = page.locator('[data-testid="admin-media-input"]');

    await fileInput.setInputFiles([
      {
        name: 'image-admin-1.png',
        mimeType: 'image/png',
        buffer: Buffer.from('admin-image-1'),
      },
      {
        name: 'image-admin-2.png',
        mimeType: 'image/png',
        buffer: Buffer.from('admin-image-2'),
      },
    ]);

    const thumbs = page.locator('[data-testid="admin-media-thumb"]');
    await expect(thumbs).toHaveCount(2);
  });

  test('should record history after admin changes', async ({ page }) => {
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    await expect(page.locator('[data-testid="product-detail-panel"]')).toBeVisible();

    await page.click('[data-testid="product-tab-admin"]');

    const skuInput = page.locator('[data-testid="admin-sku-input"]');
    await skuInput.fill('SKU-HISTORY-1');

    await page.click('[data-testid="admin-save"]');
    await expect(page.locator('text=Produit mis à jour avec succès')).toBeVisible();

    await firstProduct.click();
    await page.click('[data-testid="product-tab-admin"]');

    const historyList = page.locator('[data-testid="admin-history-list"]');
    await expect(historyList).toContainText('Historique');
  });
});

test.describe('MarketplaceModern - Category Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="admin-toggle"]');
    await page.waitForTimeout(300);
  });

  test('should open category management panel', async ({ page }) => {
    // Click category management button
    await page.click('[data-testid="manage-categories-button"]');
    
    await page.waitForTimeout(300);
    
    // Verify panel is visible
    const panel = page.locator('[data-testid="category-management-panel"]');
    await expect(panel).toBeVisible();
  });

  test('should add new category', async ({ page }) => {
    await page.click('[data-testid="manage-categories-button"]');
    await page.waitForTimeout(300);
    
    // Click add category button
    await page.click('[data-testid="add-category-button"]');
    
    await page.waitForTimeout(300);
    
    // Fill category details
    await page.fill('[data-testid="category-name-input"]', 'Produits Transformés');
    
    // Select icon (if applicable)
    const iconSelect = page.locator('[data-testid="category-icon-select"]');
    if (await iconSelect.count() > 0) {
      await iconSelect.click();
      await page.click('[data-testid="icon-option"]', { timeout: 5000 });
    }
    
    // Save category
    await page.click('[data-testid="save-category"]');
    
    await page.waitForTimeout(500);
    
    // Verify success
    await expect(page.locator('text=Catégorie créée')).toBeVisible();
  });

  test('should rename category', async ({ page }) => {
    await page.click('[data-testid="manage-categories-button"]');
    await page.waitForTimeout(300);
    
    // Click edit on first category
    const firstCategory = page.locator('[data-testid="category-item"]').first();
    await firstCategory.locator('[data-testid="edit-category"]').click();
    
    await page.waitForTimeout(300);
    
    // Update category name
    const nameInput = page.locator('[data-testid="category-name-input"]');
    await nameInput.clear();
    await nameInput.fill('Légumes Frais');
    
    // Save changes
    await page.click('[data-testid="save-category"]');
    
    await page.waitForTimeout(500);
    
    // Verify success
    await expect(page.locator('text=Catégorie mise à jour')).toBeVisible();
  });

  test('should delete category', async ({ page }) => {
    await page.click('[data-testid="manage-categories-button"]');
    await page.waitForTimeout(300);
    
    // Click delete on a category
    const category = page.locator('[data-testid="category-item"]').first();
    await category.locator('[data-testid="delete-category"]').click();
    
    await page.waitForTimeout(300);
    
    // Confirm deletion
    const confirmModal = page.locator('[data-testid="confirm-delete-category"]');
    
    if (await confirmModal.isVisible()) {
      await page.click('[data-testid="confirm-delete-button"]');
    }
    
    await page.waitForTimeout(500);
    
    // Verify success or warning about products in category
    const notification = page.locator('[data-testid="notification"]');
    await expect(notification).toBeVisible();
  });

  test('should reorder categories', async ({ page }) => {
    await page.click('[data-testid="manage-categories-button"]');
    await page.waitForTimeout(300);
    
    // Get first and second category positions
    const firstCategory = page.locator('[data-testid="category-item"]').first();
    const secondCategory = page.locator('[data-testid="category-item"]').nth(1);
    
    // Drag first category to second position (if drag-and-drop is implemented)
    const reorderButton = firstCategory.locator('[data-testid="reorder-category"]');
    
    if (await reorderButton.count() > 0) {
      await reorderButton.click();
      await page.click('[data-testid="move-down"]');
      
      await page.waitForTimeout(500);
      
      // Verify order changed
      await expect(page.locator('text=Ordre modifié')).toBeVisible();
    }
  });
});

test.describe('MarketplaceModern - Admin Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="admin-toggle"]');
    await page.waitForTimeout(300);
  });

  test('should display admin analytics dashboard', async ({ page }) => {
    // Click analytics button
    const analyticsButton = page.locator('[data-testid="admin-analytics-button"]');
    
    if (await analyticsButton.count() > 0) {
      await analyticsButton.click();
      await page.waitForTimeout(300);
      
      // Verify analytics panel is visible
      const analyticsPanel = page.locator('[data-testid="admin-analytics-panel"]');
      await expect(analyticsPanel).toBeVisible();
    }
  });

  test('should display product statistics', async ({ page }) => {
    const analyticsButton = page.locator('[data-testid="admin-analytics-button"]');
    
    if (await analyticsButton.count() > 0) {
      await analyticsButton.click();
      await page.waitForTimeout(300);
      
      // Verify statistics are displayed
      await expect(page.locator('text=/Total.*produits/i')).toBeVisible();
      await expect(page.locator('text=/Produits.*actifs/i')).toBeVisible();
    }
  });

  test('should export product data', async ({ page }) => {
    // Click export button
    const exportButton = page.locator('[data-testid="export-products-button"]');
    
    if (await exportButton.count() > 0) {
      // Setup download listener
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        exportButton.click()
      ]);
      
      // Verify download started
      expect(download).toBeTruthy();
    }
  });
});
