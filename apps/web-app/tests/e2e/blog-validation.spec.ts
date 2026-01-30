import { test, expect } from '@playwright/test'

test.describe('Blog V3 - AgriLogistic', () => {
  
  test('Blog Listing - Visibility Check', async ({ page }) => {
    // Increase timeout for global action
    test.setTimeout(60000)
    
    await page.goto('/blog', { waitUntil: 'load' })
    
    // Check main title
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 20000 })
    
    // Check tab navigation items
    await expect(page.getByText(/Mise en avant/i)).toBeVisible()
    await expect(page.getByText(/Tous les articles/i)).toBeVisible()
    
    // Check card presence
    const blogCards = page.locator('a[href^="/blog/"]')
    await expect(blogCards.first()).toBeVisible({ timeout: 10000 })
  })

  test('Blog Detail - Basic Navigation', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('/blog')
    
    const firstArticle = page.locator('a[href^="/blog/"]').first()
    await expect(firstArticle).toBeVisible({ timeout: 20000 })
    await firstArticle.click()
    
    await expect(page).toHaveURL(/\/blog\/.+/)
    await expect(page.locator('h1')).toBeVisible()
  })
})


