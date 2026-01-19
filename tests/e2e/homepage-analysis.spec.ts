/**
 * =======================================================
 * PLAYWRIGHT E2E - Analyse et Modernisation Homepage
 * =======================================================
 * Analyse technique complète de la page d'accueil
 * - Structure HTML/CSS
 * - Performance et accessibilité
 * - Éléments à moderniser
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "http://localhost:5173";
const ANALYSIS_DIR = path.join(process.cwd(), "tests", "e2e", "analysis-reports");

// Créer le dossier de rapports s'il n'existe pas
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

test.describe("Homepage Analysis - Structure & Performance", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("1. Analyser la structure HTML de la page d'accueil", async ({ page }) => {
    console.log("\n📋 ANALYSE DE LA STRUCTURE HTML\n");

    // Analyser les sections principales
    const sections = await page.locator("section, main, div[role='main']").all();
    console.log(`✓ Nombre de sections principales: ${sections.length}`);

    // Analyser les images
    const images = await page.locator("img").all();
    const imageData = [];
    
    for (const img of images) {
      const src = await img.getAttribute("src");
      const alt = await img.getAttribute("alt");
      const width = await img.evaluate((el) => el.clientWidth);
      const height = await img.evaluate((el) => el.clientHeight);
      
      imageData.push({ src, alt, width, height });
      console.log(`  📷 Image: ${src} (${width}x${height}px) - Alt: "${alt}"`);
    }

    // Analyser les icônes
    const svgIcons = await page.locator("svg").all();
    console.log(`✓ Nombre d'icônes SVG: ${svgIcons.length}`);

    // Analyser les boutons
    const buttons = await page.locator("button, a[role='button']").all();
    console.log(`✓ Nombre de boutons: ${buttons.length}`);

    // Analyser la navigation
    const navLinks = await page.locator("nav a, header a").all();
    console.log(`✓ Liens de navigation: ${navLinks.length}`);

    // Sauvegarder le rapport
    const report = {
      timestamp: new Date().toISOString(),
      sections: sections.length,
      images: imageData,
      svgIcons: svgIcons.length,
      buttons: buttons.length,
      navLinks: navLinks.length,
    };

    fs.writeFileSync(
      path.join(ANALYSIS_DIR, "structure-analysis.json"),
      JSON.stringify(report, null, 2)
    );

    expect(sections.length).toBeGreaterThan(0);
  });

  test("2. Analyser les performances de chargement", async ({ page }) => {
    console.log("\n⚡ ANALYSE DES PERFORMANCES\n");

    // Mesurer les métriques de performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find((p) => p.name === "first-paint")?.startTime || 0,
        firstContentfulPaint: paint.find((p) => p.name === "first-contentful-paint")?.startTime || 0,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      };
    });

    console.log("📊 Métriques de Performance:");
    console.log(`  • DOM Content Loaded: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`  • Load Complete: ${performanceMetrics.loadComplete.toFixed(2)}ms`);
    console.log(`  • First Paint: ${performanceMetrics.firstPaint.toFixed(2)}ms`);
    console.log(`  • First Contentful Paint: ${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);
    console.log(`  • DOM Interactive: ${performanceMetrics.domInteractive.toFixed(2)}ms`);
    console.log(`  • Total Time: ${performanceMetrics.totalTime.toFixed(2)}ms`);

    // Analyser les ressources chargées
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      return entries.map((entry) => ({
        name: entry.name,
        type: entry.initiatorType,
        size: entry.transferSize || 0,
        duration: entry.duration,
      }));
    });

    const imageResources = resources.filter((r) => r.type === "img");
    const totalImageSize = imageResources.reduce((sum, r) => sum + r.size, 0);
    
    console.log(`\n📦 Ressources Chargées:`);
    console.log(`  • Total images: ${imageResources.length}`);
    console.log(`  • Taille totale images: ${(totalImageSize / 1024).toFixed(2)} KB`);

    // Sauvegarder le rapport
    fs.writeFileSync(
      path.join(ANALYSIS_DIR, "performance-analysis.json"),
      JSON.stringify({ performanceMetrics, resources }, null, 2)
    );

    // Vérifications
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(3000); // < 3s
    expect(performanceMetrics.domInteractive).toBeLessThan(5000); // < 5s
  });

  test("3. Analyser l'accessibilité (WCAG)", async ({ page }) => {
    console.log("\n♿ ANALYSE D'ACCESSIBILITÉ\n");

    // Vérifier les attributs alt des images
    const imagesWithoutAlt = await page.locator("img:not([alt])").all();
    console.log(`⚠️  Images sans attribut alt: ${imagesWithoutAlt.length}`);

    // Vérifier les labels ARIA
    const elementsWithAriaLabel = await page.locator("[aria-label]").all();
    console.log(`✓ Éléments avec aria-label: ${elementsWithAriaLabel.length}`);

    // Vérifier les rôles ARIA
    const elementsWithRole = await page.locator("[role]").all();
    console.log(`✓ Éléments avec rôle ARIA: ${elementsWithRole.length}`);

    // Vérifier les headings (structure sémantique)
    const headings = await page.evaluate(() => {
      const h1 = document.querySelectorAll("h1").length;
      const h2 = document.querySelectorAll("h2").length;
      const h3 = document.querySelectorAll("h3").length;
      const h4 = document.querySelectorAll("h4").length;
      return { h1, h2, h3, h4 };
    });

    console.log(`\n📑 Structure des Titres:`);
    console.log(`  • H1: ${headings.h1}`);
    console.log(`  • H2: ${headings.h2}`);
    console.log(`  • H3: ${headings.h3}`);
    console.log(`  • H4: ${headings.h4}`);

    // Vérifier le contraste des couleurs (simulation basique)
    const contrastIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      let issues = 0;
      
      elements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Vérification simplifiée (dans un vrai test, utiliser une lib de contraste)
        if (color === "rgb(255, 255, 255)" && bgColor === "rgb(255, 255, 255)") {
          issues++;
        }
      });
      
      return issues;
    });

    console.log(`⚠️  Problèmes de contraste potentiels: ${contrastIssues}`);

    // Vérifier la navigation au clavier
    const focusableElements = await page.locator("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])").all();
    console.log(`✓ Éléments focusables (navigation clavier): ${focusableElements.length}`);

    // Sauvegarder le rapport
    const accessibilityReport = {
      timestamp: new Date().toISOString(),
      imagesWithoutAlt: imagesWithoutAlt.length,
      elementsWithAriaLabel: elementsWithAriaLabel.length,
      elementsWithRole: elementsWithRole.length,
      headings,
      contrastIssues,
      focusableElements: focusableElements.length,
    };

    fs.writeFileSync(
      path.join(ANALYSIS_DIR, "accessibility-analysis.json"),
      JSON.stringify(accessibilityReport, null, 2)
    );

    // Vérifications critiques
    expect(imagesWithoutAlt.length).toBe(0); // Toutes les images doivent avoir un alt
    expect(headings.h1).toBeGreaterThan(0); // Au moins un H1
  });

  test("4. Analyser le responsive design", async ({ page, viewport }) => {
    console.log("\n📱 ANALYSE DU RESPONSIVE DESIGN\n");

    const viewports = [
      { name: "Mobile", width: 375, height: 667 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Desktop", width: 1920, height: 1080 },
    ];

    const responsiveReport: any = {};

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(500); // Attendre le reflow

      console.log(`\n🖥️  Viewport: ${vp.name} (${vp.width}x${vp.height})`);

      // Vérifier les éléments visibles
      const visibleElements = await page.evaluate(() => {
        const elements = document.querySelectorAll("*");
        let visible = 0;
        
        elements.forEach((el) => {
          const styles = window.getComputedStyle(el);
          if (styles.display !== "none" && styles.visibility !== "hidden") {
            visible++;
          }
        });
        
        return visible;
      });

      console.log(`  • Éléments visibles: ${visibleElements}`);

      // Vérifier le débordement horizontal
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      console.log(`  • Débordement horizontal: ${hasHorizontalScroll ? "OUI ⚠️" : "NON ✓"}`);

      // Capturer une screenshot
      await page.screenshot({
        path: path.join(ANALYSIS_DIR, `screenshot-${vp.name.toLowerCase()}.png`),
        fullPage: true,
      });

      responsiveReport[vp.name] = {
        viewport: vp,
        visibleElements,
        hasHorizontalScroll,
      };

      expect(hasHorizontalScroll).toBe(false);
    }

    fs.writeFileSync(
      path.join(ANALYSIS_DIR, "responsive-analysis.json"),
      JSON.stringify(responsiveReport, null, 2)
    );
  });

  test("5. Identifier les éléments à moderniser", async ({ page }) => {
    console.log("\n🎨 IDENTIFICATION DES ÉLÉMENTS À MODERNISER\n");

    const modernizationNeeds = {
      timestamp: new Date().toISOString(),
      images: [] as any[],
      icons: [] as any[],
      layout: [] as any[],
      interactions: [] as any[],
    };

    // Analyser les images à remplacer
    const images = await page.locator("img").all();
    for (const img of images) {
      const src = await img.getAttribute("src");
      const alt = await img.getAttribute("alt");
      const isPlaceholder = src?.includes("placeholder") || src?.includes("example");
      
      if (isPlaceholder || !alt) {
        modernizationNeeds.images.push({
          src,
          alt,
          issue: isPlaceholder ? "Image placeholder à remplacer" : "Alt manquant",
          priority: "HIGH",
        });
      }
    }

    console.log(`📷 Images à moderniser: ${modernizationNeeds.images.length}`);

    // Analyser les icônes
    const iconElements = await page.locator("[class*='icon'], [class*='Icon'], svg").all();
    for (const icon of iconElements.slice(0, 10)) { // Limiter à 10 pour la démo
      const className = await icon.getAttribute("class");
      const tagName = await icon.evaluate((el) => el.tagName);
      
      if (tagName !== "svg") {
        modernizationNeeds.icons.push({
          type: tagName,
          className,
          suggestion: "Remplacer par une icône SVG moderne",
          priority: "MEDIUM",
        });
      }
    }

    console.log(`🎯 Icônes à moderniser: ${modernizationNeeds.icons.length}`);

    // Analyser la mise en page
    const layoutIssues = await page.evaluate(() => {
      const issues: any[] = [];
      
      // Vérifier les éléments avec position fixed/absolute
      const fixedElements = document.querySelectorAll("[style*='position: fixed'], [style*='position: absolute']");
      if (fixedElements.length > 5) {
        issues.push({
          type: "layout",
          issue: "Trop d'éléments en position fixed/absolute",
          count: fixedElements.length,
          suggestion: "Utiliser flexbox/grid pour un layout moderne",
        });
      }

      // Vérifier l'utilisation de float
      const floatElements = document.querySelectorAll("[style*='float:']");
      if (floatElements.length > 0) {
        issues.push({
          type: "layout",
          issue: "Utilisation de float (technique obsolète)",
          count: floatElements.length,
          suggestion: "Remplacer par flexbox/grid",
        });
      }

      return issues;
    });

    modernizationNeeds.layout = layoutIssues;
    console.log(`📐 Problèmes de layout: ${layoutIssues.length}`);

    // Analyser les interactions
    const buttons = await page.locator("button").all();
    for (const button of buttons.slice(0, 5)) {
      const hasHoverEffect = await button.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.transition !== "all 0s ease 0s";
      });

      if (!hasHoverEffect) {
        modernizationNeeds.interactions.push({
          element: "button",
          issue: "Pas d'effet hover/transition",
          suggestion: "Ajouter des transitions modernes",
          priority: "LOW",
        });
      }
    }

    console.log(`🎭 Interactions à améliorer: ${modernizationNeeds.interactions.length}`);

    // Sauvegarder le rapport complet
    fs.writeFileSync(
      path.join(ANALYSIS_DIR, "modernization-needs.json"),
      JSON.stringify(modernizationNeeds, null, 2)
    );

    console.log(`\n✅ Rapport de modernisation sauvegardé dans: ${ANALYSIS_DIR}`);
  });
});
