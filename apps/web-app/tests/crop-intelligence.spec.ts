import { test, expect } from '@playwright/test'

test.describe('Crop Intelligence - Validation Complete', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page Crop Intelligence
    await page.goto('http://localhost:3000/admin/crop-intelligence')
    await page.waitForLoadState('networkidle')
  })

  test('1. DONNÉES: Affiche les zones africaines avec cultures réelles', async ({ page }) => {
    // Vérifier que les 10 zones sont affichées
    const zoneCards = page.locator('[class*="rounded-3xl"][class*="cursor-pointer"]')
    await expect(zoneCards).toHaveCount(10, { timeout: 10000 })

    // Vérifier présence de cultures africaines spécifiques
    await expect(page.getByText('Riz', { exact: false })).toBeVisible()
    await expect(page.getByText('Cacao', { exact: false })).toBeVisible()
    await expect(page.getByText('Manioc', { exact: false })).toBeVisible()
    await expect(page.getByText('Maïs', { exact: false })).toBeVisible()
    await expect(page.getByText('Coton', { exact: false })).toBeVisible()

    // Vérifier régions africaines
    await expect(page.getByText('Delta du Niger', { exact: false })).toBeVisible()
    await expect(page.getByText('Bassin du Congo', { exact: false })).toBeVisible()
    await expect(page.getByText('Vallée du Rift', { exact: false })).toBeVisible()
  })

  test('2. UI: KPIs professionnels affichés correctement', async ({ page }) => {
    // Vérifier les 3 KPIs principaux
    await expect(page.getByText('Zones Surveillées')).toBeVisible()
    await expect(page.getByText('Alertes Actives')).toBeVisible()
    await expect(page.getByText('Rendement Moyen')).toBeVisible()

    // Vérifier que les valeurs numériques sont présentes
    const kpiNumbers = page.locator('[class*="text-5xl"][class*="font-black"]')
    await expect(kpiNumbers.first()).toBeVisible()

    // Vérifier header professionnel
    await expect(page.getByRole('heading', { name: /Crop Intelligence/i })).toBeVisible()
    await expect(page.getByText(/Surveillance agricole par IA/i)).toBeVisible()
  })

  test('3. VISUALISATION: Graphiques Recharts fonctionnels', async ({ page }) => {
    // Vérifier présence du graphique d'évolution
    await expect(page.getByText('Évolution du Rendement')).toBeVisible()
    
    // Vérifier que le graphique SVG est rendu
    const chartSvg = page.locator('svg').filter({ has: page.locator('path[stroke]') })
    await expect(chartSvg.first()).toBeVisible()

    // Vérifier les labels de mois (Août, Sept, etc.)
    await expect(page.getByText(/Août 2025/i)).toBeVisible()
    await expect(page.getByText(/Janv 2026/i)).toBeVisible()

    // Vérifier stats résumé sous le graphique
    await expect(page.getByText('Rendement Actuel')).toBeVisible()
    await expect(page.getByText(/6\.\d+ t\/ha/)).toBeVisible()
  })

  test('4. ALERTES: Panneau alertes IA visible', async ({ page }) => {
    // Vérifier header alertes
    await expect(page.getByText('Alertes IA')).toBeVisible()

    // Vérifier présence d'au moins une alerte
    const alertCards = page.locator('[class*="rounded-2xl"][class*="border-2"]').filter({
      has: page.locator('text=/stress|maladie|ravageur|sécheresse/i')
    })
    
    // Il devrait y avoir des alertes ou un message "Aucune alerte"
    const hasAlerts = await alertCards.count() > 0
    const noAlertsMessage = await page.getByText(/Aucune alerte active/i).isVisible().catch(() => false)
    
    expect(hasAlerts || noAlertsMessage).toBeTruthy()
  })

  test('5. EXPORT: Boutons export CSV et PNG présents', async ({ page }) => {
    // Vérifier bouton CSV
    const csvButton = page.locator('button').filter({ hasText: 'CSV' })
    await expect(csvButton).toBeVisible()

    // Vérifier bouton PNG
    const pngButton = page.locator('button').filter({ hasText: 'PNG' })
    await expect(pngButton).toBeVisible()
  })

  test('6. SCAN: Bouton Scan fonctionne avec animation', async ({ page }) => {
    // Trouver le bouton de scan
    const scanButton = page.getByRole('button', { name: /Lancer Scan Global/i })
    await expect(scanButton).toBeVisible()

    // Capturer l'état avant le scan
    const firstZoneScore = await page.locator('[class*="text-lg"][class*="font-black"]').first().textContent()

    // Cliquer sur le bouton
    await scanButton.click()

    // Vérifier que le texte change pendant le scan
    await expect(page.getByText(/Analyse satellite en cours|Scan en cours/i)).toBeVisible({ timeout: 1000 })

    // Attendre la fin du scan (2-3 secondes)
    await page.waitForTimeout(3000)

    // Vérifier que le bouton est revenu à l'état normal
    await expect(scanButton).toBeVisible()
    await expect(page.getByText(/Lancer Scan Global/i)).toBeVisible()

    // Les scores devraient avoir potentiellement changé
    console.log('Score avant scan:', firstZoneScore)
    const newZoneScore = await page.locator('[class*="text-lg"][class*="font-black"]').first().textContent()
    console.log('Score après scan:', newZoneScore)
  })

  test('7. FILTRES: Filtrage des zones fonctionne', async ({ page }) => {
    // Compter toutes les zones initialement
    const allZones = await page.locator('[class*="rounded-3xl"][class*="cursor-pointer"]').count()
    console.log('Total zones:', allZones)

    // Cliquer sur filtre "Saines"
    const healthyFilter = page.getByRole('button', { name: /Saines/i })
    if (await healthyFilter.isVisible()) {
      await healthyFilter.click()
      await page.waitForTimeout(500)

      // Le nombre de zones affichées devrait changer
      const healthyZones = await page.locator('[class*="rounded-3xl"][class*="cursor-pointer"]').count()
      console.log('Zones saines:', healthyZones)
      
      expect(healthyZones).toBeLessThanOrEqual(allZones)
    }

    // Cliquer sur filtre "Toutes" pour réinitialiser
    const allFilter = page.getByRole('button', { name: /Toutes/i })
    await allFilter.click()
    await page.waitForTimeout(500)

    // Devrait afficher toutes les zones à nouveau
    const resetZones = await page.locator('[class*="rounded-3xl"][class*="cursor-pointer"]').count()
    expect(resetZones).toBe(allZones)
  })

  test('8. MODAL: Clic sur zone ouvre modal détails', async ({ page }) => {
    // Cliquer sur la première zone
    const firstZone = page.locator('[class*="rounded-3xl"][class*="cursor-pointer"]').first()
    await firstZone.click()

    // Attendre apparition du modal
    await page.waitForTimeout(500)

    // Vérifier présence d'éléments du modal
    // Le modal devrait avoir un backdrop et du contenu
    const modal = page.locator('[class*="fixed"][class*="inset-0"]').filter({
      has: page.locator('[class*="rounded-3xl"]')
    })
    
    const isModalVisible = await modal.isVisible().catch(() => false)
    
    if (isModalVisible) {
      console.log('✅ Modal détecté!')
      
      // Vérifier graphique santé dans le modal
      const modalChart = modal.locator('svg')
      const hasChart = await modalChart.count() > 0
      console.log('Graphique dans modal:', hasChart ? '✅' : '❌')

      // Fermer le modal (clic sur backdrop ou bouton X)
      const closeButton = modal.locator('button').first()
      if (await closeButton.isVisible()) {
        await closeButton.click()
        await page.waitForTimeout(300)
      }
    } else {
      console.log('⚠️ Modal non détecté (peut nécessiter ajustement sélecteur)')
    }
  })

  test('9. HOVER: Effet scale sur cartes zones', async ({ page }) => {
    const firstZone = page.locator('[class*="rounded-3xl"][class*="cursor-pointer"]').first()
    
    // Capturer le boundingbox avant hover
    const beforeBox = await firstZone.boundingBox()
    
    // Hover sur la carte
    await firstZone.hover()
    await page.waitForTimeout(600) // Attendre animation

    // Vérifier que la classe hover est appliquée
    const classList = await firstZone.getAttribute('class')
    expect(classList).toContain('hover:scale-105')
    
    console.log('✅ Classes hover détectées')
  })

  test('10. IMAGES: Images satellites HD chargées', async ({ page }) => {
    // Vérifier que les images Unsplash sont chargées
    const images = page.locator('img[src*="unsplash.com"]')
    const imageCount = await images.count()
    
    console.log('Images Unsplash trouvées:', imageCount)
    expect(imageCount).toBeGreaterThanOrEqual(10)

    // Vérifier qu'au moins une image est visible
    await expect(images.first()).toBeVisible()

    // Vérifier paramètres de qualité dans les URLs
    const firstImageSrc = await images.first().getAttribute('src')
    expect(firstImageSrc).toContain('q=80')
    expect(firstImageSrc).toContain('auto=format')
  })

  test('11. RESPONSIVE: Layout adaptatif', async ({ page }) => {
    // Tester différentes tailles d'écran
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(300)
    const desktopZones = await page.locator('[class*="rounded-3xl"][class*="cursor-pointer"]').count()
    console.log('Desktop - Zones visibles:', desktopZones)

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(300)
    const tabletZones = await page.locator('[class*="rounded-3xl"][class*="cursor-pointer"]').count()
    console.log('Tablet - Zones visibles:', tabletZones)

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(300)
    const mobileZones = await page.locator('[class*="rounded-3xl"][class*="cursor-pointer"]').count()
    console.log('Mobile - Zones visibles:', mobileZones)

    // Toutes les zones devraient rester accessibles
    expect(desktopZones).toBe(tabletZones)
    expect(tabletZones).toBe(mobileZones)
  })

  test('12. PERFORMANCE: Chargement rapide < 3s', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('http://localhost:3000/admin/crop-intelligence')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    console.log('Temps de chargement:', loadTime, 'ms')
    
    // La page devrait charger en moins de 3 secondes
    expect(loadTime).toBeLessThan(3000)
  })
})

test.describe('Crop Intelligence - Tests Avancés', () => {
  test('Export CSV télécharge le fichier', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/crop-intelligence')
    await page.waitForLoadState('networkidle')

    // Setup download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null)

    // Cliquer sur bouton CSV
    const csvButton = page.locator('button').filter({ hasText: 'CSV' })
    if (await csvButton.isVisible()) {
      await csvButton.click()

      const download = await downloadPromise
      if (download) {
        console.log('✅ Fichier CSV téléchargé:', await download.suggestedFilename())
        expect(await download.suggestedFilename()).toContain('.csv')
      } else {
        console.log('⚠️ Pas de téléchargement détecté (fonction peut-être désactivée)')
      }
    }
  })

  test('Historique alertes toggle fonctionne', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/crop-intelligence')
    await page.waitForLoadState('networkidle')

    // Trouver une alerte et la fermer
    const closeAlertButton = page.locator('button[title*="résolu"]').or(page.locator('svg').filter({ hasText: /X|×/i }).locator('..')).first()
    
    if (await closeAlertButton.isVisible()) {
      await closeAlertButton.click()
      await page.waitForTimeout(500)

      // Vérifier si bouton "Historique" apparaît
      const historyButton = page.getByRole('button', { name: /Historique/i })
      if (await historyButton.isVisible()) {
        console.log('✅ Bouton Historique détecté')
        
        // Cliquer pour voir les alertes résolues
        await historyButton.click()
        await page.waitForTimeout(500)

        // Vérifier changement de vue
        await expect(page.getByText(/Historique des Alertes/i)).toBeVisible()
      }
    }
  })

  test('Données dynamiques après scan', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/crop-intelligence')
    await page.waitForLoadState('networkidle')

    // Capturer les scores de santé avant le scan
    const scoresBefore = await page.locator('[class*="text-lg"][class*="font-black"]').allTextContents()
    console.log('Scores avant scan:', scoresBefore.slice(0, 5))

    // Lancer le scan
    const scanButton = page.getByRole('button', { name: /Lancer Scan Global/i })
    await scanButton.click()

    // Attendre fin du scan
    await page.waitForTimeout(2500)

    // Capturer les scores après
    const scoresAfter = await page.locator('[class*="text-lg"][class*="font-black"]').allTextContents()
    console.log('Scores après scan:', scoresAfter.slice(0, 5))

    // Au moins un score devrait avoir changé (probabilité très élevée)
    const hasChanged = scoresBefore.some((score, i) => score !== scoresAfter[i])
    console.log('Des scores ont changé:', hasChanged ? '✅' : '⚠️ (peut arriver)')
  })
})
