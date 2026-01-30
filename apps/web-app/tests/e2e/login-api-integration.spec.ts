import { test, expect } from '@playwright/test'

/**
 * Tests d'intégration API pour le dashboard de connexion
 * 
 * Ces tests vérifient l'intégration complète avec l'API backend
 */

const BASE_URL = 'http://localhost:3002'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

test.describe('Intégration API - Dashboard de Connexion', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('devrait envoyer les bonnes données à l\'API lors de la connexion', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/mot de passe/i)
    const submitButton = page.getByRole('button', { name: /se connecter/i })
    
    const testEmail = 'test@example.com'
    const testPassword = 'password123'
    
    // Intercepter la requête API
    const requestPromise = page.waitForRequest(request => 
      request.url().includes('/api/v1/auth/login') && 
      request.method() === 'POST'
    )
    
    await emailInput.fill(testEmail)
    await passwordInput.fill(testPassword)
    await submitButton.click()
    
    const request = await requestPromise
    
    // Vérifier l'URL
    expect(request.url()).toContain('/api/v1/auth/login')
    
    // Vérifier la méthode
    expect(request.method()).toBe('POST')
    
    // Vérifier les headers
    const headers = request.headers()
    expect(headers['content-type']).toContain('application/json')
    
    // Vérifier le body
    const postData = request.postDataJSON()
    expect(postData.email).toBe(testEmail)
    expect(postData.password).toBe(testPassword)
  })

  test('devrait gérer correctement les erreurs API (401)', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/mot de passe/i)
    const submitButton = page.getByRole('button', { name: /se connecter/i })
    
    // Intercepter avec une erreur 401
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Invalid credentials',
        }),
      })
    })
    
    await emailInput.fill('wrong@example.com')
    await passwordInput.fill('wrongpassword')
    await submitButton.click()
    
    // Vérifier le message d'erreur
    await expect(page.getByText(/email ou mot de passe incorrect/i)).toBeVisible({ timeout: 5000 })
  })

  test('devrait gérer correctement les erreurs API (429 - Rate Limit)', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/mot de passe/i)
    const submitButton = page.getByRole('button', { name: /se connecter/i })
    
    // Intercepter avec une erreur 429
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
        }),
      })
    })
    
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await submitButton.click()
    
    // Vérifier le message d'erreur
    await expect(page.getByText(/trop de tentatives/i)).toBeVisible({ timeout: 5000 })
  })

  test('devrait gérer correctement les erreurs API (500 - Server Error)', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/mot de passe/i)
    const submitButton = page.getByRole('button', { name: /se connecter/i })
    
    // Intercepter avec une erreur 500
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
        }),
      })
    })
    
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    await submitButton.click()
    
    // Vérifier le message d'erreur
    await expect(page.getByText(/erreur serveur/i)).toBeVisible({ timeout: 5000 })
  })

  test('devrait stocker les tokens après une connexion réussie', async ({ page, context }) => {
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/mot de passe/i)
    const submitButton = page.getByRole('button', { name: /se connecter/i })
    
    const mockAccessToken = 'mock-access-token-123'
    const mockRefreshToken = 'mock-refresh-token-456'
    
    // Intercepter avec une réponse de succès
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'farmer',
            name: 'Test User',
          },
        }),
      })
    })
    
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    
    // Attendre la navigation
    await Promise.all([
      page.waitForURL('**/dashboard/farmer', { timeout: 10000 }),
      submitButton.click(),
    ])
    
    // Vérifier que les tokens sont stockés dans localStorage
    const storageData = await page.evaluate(() => {
      return {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
      }
    })
    
    expect(storageData.accessToken).toBe(mockAccessToken)
    expect(storageData.refreshToken).toBe(mockRefreshToken)
  })

  test('devrait envoyer les bonnes données pour mot de passe oublié', async ({ page }) => {
    const forgotPasswordButton = page.getByRole('button', { name: /mot de passe oublié/i })
    
    await forgotPasswordButton.click()
    
    const emailInput = page.getByLabel(/email/i).filter({ hasText: '' })
    const sendButton = page.getByRole('button', { name: /envoyer/i })
    
    const testEmail = 'test@example.com'
    
    // Intercepter la requête API
    const requestPromise = page.waitForRequest(request => 
      request.url().includes('/api/v1/auth/forgot-password') && 
      request.method() === 'POST'
    )
    
    await emailInput.fill(testEmail)
    await sendButton.click()
    
    const request = await requestPromise
    
    // Vérifier l'URL
    expect(request.url()).toContain('/api/v1/auth/forgot-password')
    
    // Vérifier la méthode
    expect(request.method()).toBe('POST')
    
    // Vérifier le body
    const postData = request.postDataJSON()
    expect(postData.email).toBe(testEmail)
  })
})
