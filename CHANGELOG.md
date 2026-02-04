# Changelog – AgroDeep Platform

Les modifications notables au niveau plateforme sont documentées ici.  
Voir aussi `apps/web-app/CHANGELOG.md` pour la web-app et `docs/CLEANUP_REPORT.md` pour le détail du nettoyage.

---

## [Non publié]

### Nettoyage complémentaire (2026-02-04)

- **Suppression du dossier `.backups/`** : 4 sauvegardes auth-service obsolètes (générées par `fix-auth-service.ps1`) supprimées. Ajout de `.backups/` au `.gitignore`.
- **Artefacts E2E** : Ajout au `.gitignore` de `tests/e2e/screenshots/`, `tests/e2e/analysis-reports/`, `apps/web-app/test-results/`, `apps/web-app/playwright-report/`.
- **Tests E2E** : Suppression des specs redondants `auth-dev-mode.spec.ts` et `auth-stable-e2e.spec.ts` (scénarios déjà couverts par `auth.spec.ts` et `auth-complete.spec.ts`). Mise à jour de `tests/e2e/README.md` et `docs/CLEANUP_REPORT.md`.

### Nettoyage du code source (2026-02-03)

- **Suppressions** : Fichiers temporaires et scripts obsolètes (voir `docs/CLEANUP_REPORT.md`).
  - Racine : `discovery_output.txt`.
  - `apps/web-app` : `test_output*.txt`, `final_*_test.txt`, `final_test_results.txt`, `landing_files.txt`, et 10 scripts de diagnostic/test one-off (`check-section.js`, `deep-inspect.js`, `diagnostic-images.js`, `final-verification.js`, `inspect-html.js`, `test-crop-intelligence.js`, `test-enhanced-ui.js`, `test-no-cache.js`, `test-performance-section.js`, `test-widgets.js`).
- **.gitignore** : Ajout de patterns pour éviter le retour des artefacts (`*.bak`, `*~`, `discovery_output.txt`, `test_output*.txt`, `final_*_test.txt`, `final_test_results.txt`, `landing_files.txt`).
- **Documentation** : Rapport détaillé dans `docs/CLEANUP_REPORT.md`.

Aucune modification du code source applicatif ; uniquement suppressions et configuration.
