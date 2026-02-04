# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.2.1] - 2026-02-03

### Supprimé (nettoyage)

- Fichiers de sortie / temporaires : `test_output.txt`, `test_output_2.txt`, `test_output_3.txt`, `final_final_test.txt`, `final_test_results.txt`, `landing_files.txt`.
- Scripts de diagnostic et tests one-off non référencés : `check-section.js`, `deep-inspect.js`, `diagnostic-images.js`, `final-verification.js`, `inspect-html.js`, `test-crop-intelligence.js`, `test-enhanced-ui.js`, `test-no-cache.js`, `test-performance-section.js`, `test-widgets.js`.

Voir `docs/CLEANUP_REPORT.md` pour le rapport complet au niveau plateforme.

---

## [3.2.0] - 2026-01-29

### 🆕 Ajouté - Plateforme Loueur Complète

#### Dataset & Architecture

- **Dataset rental-equipment.ts** : 25 équipements répartis en 4 catégories
  - Tracteurs & Engins (8 items)
  - Machines de Traitement (7 items)
  - Maintenance & Nettoyage (5 items)
  - Matériaux de Construction (5 items)
- Types TypeScript complets pour `RentalEquipment`, `EquipmentCategory`, `EquipmentType`
- Fonctions utilitaires : `getRentalStatistics()`, `getEquipmentById()`

#### Interface Publique (`/loueur`)

- **Page Storefront** (`/app/loueur/page.tsx`) : Catalogue avec filtres avancés
  - Switch LOUER/ACHETER (composant `RentalTypeSwitch`)
  - Sidebar filtres (`FilterSidebar`) : catégories, prix, disponibilité
  - Grid équipements avec cards industrielles (`IndustrialEquipmentCard`)
  - Barre recherche full-text instantanée
  - Tri multi-critères (rating, prix, nom)
  - Header fixe avec logo AgriLogistic cliquable vers landing page

- **Page Détail** (`/app/loueur/[id]/page.tsx`) : Vue détaillée équipement
  - Galerie photos interactive (jusqu'à 6 images)
- Spécifications techniques complètes
- Formulaire de contact intégré
- Badge de disponibilité dynamique
- Section promotions si applicable
- Design industriel cohérent

#### Admin Dashboard (`/admin/loueur-manager`)

- **Page Manager** (`/app/admin/loueur-manager/page.tsx`) : Interface CRUD complète
  - Tableau liste tous équipements avec pagination
  - Statistiques : Total, À Louer, À Vendre, Disponibles
  - Filtres admin : catégorie, type, recherche
  - Actions : Voir, Éditer, Supprimer
  - Bouton "Nouvel Équipement"
- **Modal Formulaire** (`/components/admin/EquipmentFormModal.tsx`) : Création/Édition
  - Informations basiques : Nom, Catégorie, Type
  - Prix : Location (jour/semaine/mois), Vente
  - Spécifications techniques détaillées
  - **Champs SEO** : Titre SEO, Meta Description, Mots-clés
  - Upload multi-images (jusqu'à 6 photos)
  - Promotions & réductions
  - Validation Zod complète

#### Navigation

- Ajout lien "Loueur de Matériel" 🔧 dans Navbar principal (menu Produits)
- Ajout lien "Gestion Loueur" dans AdminSidebar (section Opérations)

### ✅ Corrigé

#### Erreurs de Compilation

- **FilterSidebar Import** : Correction espace dans import (`Filter Sidebar` → `FilterSidebar`) dans `/app/loueur/page.tsx`
- **Directive 'use client'** : Ajout directive manquante dans `/app/admin/loueur-manager/page.tsx`
- Correction structure JSX avec fermeture divs manquantes

#### Optimisations

- Ajout header fixe avec logo dans page Loueur
- Padding top ajouté pour compenser header fixe
- Amélioration cohérence visuelle design industriel

### 📚 Documentation

- **README.md** : Modernisation complète (66 → 400+ lignes)
  - Badges statut projet (Next.js, TypeScript, Tailwind)
  - Section Quick Start améliorée
  - Documentation complète Loueur (publique + admin)
  - Diagramme architecture Mermaid
  - Structure fichiers détaillée
  - Guide déploiement Vercel
  - Métriques projet
  - Standards code (clean-code skill)
- **CHANGELOG.md** : Création fichier suivi modifications (ce fichier)

- **Artifacts créés** :
  - `rental_platform_task.md` : Checklist complète 4 phases
  - `rental_implementation_plan.md` : Plan technique détaillé
  - `rental_platform_walkthrough.md` : Documentation visuelle complète
  - `cleanup_and_docs_plan.md` : Plan cleanup & modernisation docs

### 🎨 Improved

#### Design System

- Composants industriels avec style jaune/noir/orange
- Glassmorphism sur cards et modals
- Animations hover et transitions fluides
- Badges colorés pour statuts (disponible, loué, vendu, maintenance)

#### User Experience

- Filtres réagissent instantanément (sans rechargement)
- Switch LOUER/ACHETER comme élément central UX
- Search instantanée sur nom, marque, description, tags
- Tri dynamique temps réel

---

## [3.1.0] - 2026-01-XX (Précédent)

### Ajouté

- AgroMarket : Catalogue et panier persistant
- Crop Intelligence : Dashboard analytics parcelles
- Admin Dashboard : Interfaces gestion multi-modules
- Solutions pages : Farmers, Distributors, Companies

### Fonctionnalités Core

- Authentication OAuth2/OIDC
- Multi-tenant architecture
- Dark mode sections
- Glassmorphism UI V3

---

## [3.0.0] - 2026-01-XX

### Ajouté

- Next.js 14 App Router migration
- Landing Page institutionnelle
- Blog system
- Playwright E2E tests
- Tailwind CSS 4

---

## Légende Types de Changements

- `Ajouté` : Nouvelles fonctionnalités
- `Modifié` : Modifications de fonctionnalités existantes
- `Déprécié` : Fonctionnalités bientôt supprimées
- `Supprimé` : Fonctionnalités supprimées
- `Corrigé` : Corrections de bugs
- `Sécurité` : Corrections vulnérabilités

---

**Format des dates** : YYYY-MM-DD (ISO 8601)
