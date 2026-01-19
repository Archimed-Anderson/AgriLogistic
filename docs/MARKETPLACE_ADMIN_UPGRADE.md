# 🛒 Marketplace Moderne – Admin Produits

Ce document décrit :
- les nouvelles capacités du module d’administration produits dans `MarketplaceModern`
- le contrat de données attendu par le frontend (API côté présentation)
- un guide de migration pour les données produits existantes

---

## 1. Nouvelles capacités côté UI

- Champs obligatoires avec validation temps réel :
  - `category` (catégorie principale)
  - `sku` (référence produit)
  - `promotion.value` lorsque une promotion est activée
- Gestion avancée des variantes :
  - Nom de variante (ex. `Rouge`, `Lot 5kg`)
  - Prix et unité par variante
- Gestionnaire de médias :
  - Upload multiple d’images
  - Prévisualisation immédiate
  - Ordonnancement par glisser–déposer
  - Sélection d’une image principale (`isPrimary`)
- Module promotions :
  - Type de réduction : `percentage` ou `fixed`
  - Valeur de la réduction
  - Dates de début et fin, avec activation conditionnelle via `isPromotionActive`
- Historique des modifications :
  - Entrées historisées à chaque mise à jour via `handleUpdateProduct`
  - Détails champ par champ (`field`, `from`, `to`) avec `author` et `timestamp`

---

## 2. Contrat de données côté frontend

### 2.1. Type `Product` étendu

Le composant `MarketplaceModern` s’appuie sur un type `Product` enrichi :

- Champs principaux (existants) :
  - `id: string`
  - `name: string`
  - `category: string`
  - `price: number`
  - `unit: string`
  - `image: string`
- Champs d’administration :
  - `sku?: string`
  - `visible?: boolean`
  - `isNew?: boolean`
  - `archived?: boolean`
- Variantes :
  - `variants?: Array<{ name: string; price: number; unit: string }>`
- Médias :
  - `media?: Array<{
      id: string;
      url: string;
      type: "image" | "video";
      alt?: string;
      isPrimary?: boolean;
    }>`
- Promotions :
  - `promotion?: {
      type: "percentage" | "fixed";
      value: number;
      startsAt?: string; // ISO 8601
      endsAt?: string;   // ISO 8601
      label?: string;
    }`
- Historique :
  - `history?: Array<{
      id: string;
      timestamp: string; // ISO 8601
      author: string;
      changes: Array<{
        field: string;
        from: unknown;
        to: unknown;
      }>;
    }>`

### 2.2. API d’édition produit

- Création :
  - `AddProductModal` émet `onSave(payload: Partial<Product>)`
  - Le payload inclut éventuellement `variants`, `media` et `promotion`
- Édition :
  - `ProductDetailPanel` émet `onUpdate(updates: Partial<Product>)`
  - Le conteneur (`MarketplaceModern`) applique `updates` au produit cible via `handleUpdateProduct`
  - `handleUpdateProduct` :
    - détecte les champs modifiés
    - ajoute une entrée `history` pour chaque sauvegarde avec les `changes` calculés

---

## 3. Guide de migration des données existantes

### 3.1. Objectif

Permettre aux produits déjà présents en base (ou dans des fixtures) de bénéficier :
- du nouveau module de médias
- du système de promotions conditionnelles
- de l’historique de modifications

### 3.2. Migration minimale recommandée

1. Champs obligatoires
   - Vérifier que chaque produit possède :
     - `category` renseignée (sinon, fallback `Autres`)
     - `sku` non vide (sinon générer une valeur, par exemple `SKU-<id>` côté backend)

2. Migration des médias
   - Cas legacy : seuls les champs suivants existent :
     - `image: string`
   - Migration recommandée :
     - Conserver `image` pour compatibilité
     - Initialiser `media` lorsque possible :
       - `media = [{ id: <dérivé de image>, url: image, type: "image", isPrimary: true }]`

3. Migration des promotions
   - Si aucune promotion n’existe, laisser `promotion` absent ou à `null`
   - Pour les produits déjà en promotion :
     - Renseigner :
       - `promotion.type` (`"percentage"` ou `"fixed"`)
       - `promotion.value` (nombre strictement positif)
       - `promotion.startsAt` / `promotion.endsAt` (ISO 8601) si disponibles
   - Le frontend utilise `isPromotionActive` + `computePromotionPrice` pour :
     - ne pas afficher de promotion hors période
     - calculer le prix remisé et le pourcentage économisé

4. Initialisation de l’historique
   - Les produits existants peuvent être migrés avec :
     - `history` vide ou absent
   - Toutes les prochaines éditions via `MarketplaceModern` enrichiront `history` automatiquement :
     - un enregistrement par sauvegarde
     - `changes` listant les champs effectivement modifiés

5. Variantes
   - Les anciens produits sans variantes peuvent rester sans champ `variants`
   - Pour des produits qui étaient déjà déclinés manuellement (ex. plusieurs lignes en base) :
     - envisager de les regrouper dans un seul produit avec `variants` :
       - `variants = [{ name, price, unit }, ...]`

---

## 4. Impacts backend et API

- Les endpoints de lecture produits doivent renvoyer les nouveaux champs lorsqu’ils sont présents :
  - `media`, `promotion`, `variants`, `history`
- Les endpoints d’écriture (création / mise à jour) doivent accepter :
  - `variants` et `media` en option
  - `promotion` en option, avec validation côté backend cohérente avec le frontend
- Le frontend reste rétrocompatible :
  - absence de `media` → utilisation de `image`
  - absence de `promotion` → aucun affichage promotionnel
  - absence de `history` → panneau d’historique vide mais fonctionnel

---

## 5. Résumé

- Aucune migration destructrice n’est requise.
- Les nouveaux champs sont optionnels mais fortement recommandés pour :
  - tirer parti du média manager
  - activer les promotions conditionnelles
  - bénéficier de l’historique d’édition.
- La logique de cache des médias côté frontend repose sur des URLs générées via `URL.createObjectURL` et n’impacte pas le modèle de données persistant.

