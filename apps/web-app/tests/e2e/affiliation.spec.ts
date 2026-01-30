import { test, expect } from '@playwright/test';

test.describe('Affiliation Module & Admin Hub', () => {
  
  test('Public Affiliation Page - Should render 3D background and content', async ({ page }) => {
    await page.goto('/affiliation');
    
    // Check main title (using role for specificity)
    await expect(page.getByRole('heading', { name: /Boutique/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Partenaires/i })).toBeVisible();
    
    // Check for 3D Background Canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Check for Comparison Table
    await expect(page.getByText('Les Incontournables', { exact: false })).toBeVisible();
  });

  test('Admin Affiliation Manager - Should display inventory and CRUD options', async ({ page }) => {
    await page.goto('/admin/affiliation-manager');
    
    // Check Header
    await expect(page.getByRole('heading', { name: /Affiliation Manager/i })).toBeVisible();
    
    // Check Tabs
    await expect(page.getByRole('tab', { name: /Inventaire/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Configuration/i })).toBeVisible();
    
    // Check table content
    await expect(page.getByRole('table')).toBeVisible();
    
    // Test Modal Opening
    const addProductBtn = page.getByRole('button', { name: /Nouveau Produit/i }).first();
    await expect(addProductBtn).toBeVisible();
    await addProductBtn.click();
    
    // Verify modal content (use role and specificity to avoid strict mode violation with button)
    await expect(page.getByRole('heading', { name: /Nouveau Produit/i }).first()).toBeVisible();
    await expect(page.getByText('Remplissez les informations', { exact: false })).toBeVisible();
    
    // Close modal
    await page.getByRole('button', { name: /Annuler/i }).click();
    await expect(page.getByRole('heading', { name: /Nouveau Produit/i })).not.toBeVisible();
  });

  test('Admin Affiliation Manager - Configuration Tab', async ({ page }) => {
    await page.goto('/admin/affiliation-manager');
    
    // Click on Configuration tab
    await page.getByRole('tab', { name: /Configuration/i }).click();
    
    // Check for settings fields
    await expect(page.getByText('Paramètres Généraux', { exact: false })).toBeVisible();
    // Use getByText since labels might be in a different structure if getByLabel fails
    await expect(page.getByText('Nom Public de la Boutique', { exact: false })).toBeVisible();
    await expect(page.getByText('ID Tracking Amazon Associé', { exact: false })).toBeVisible();
  });
});
