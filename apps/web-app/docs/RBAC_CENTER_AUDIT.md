# 🛡️ Audit RBAC Center - Cahier des Charges

**Date :** 1er Février 2025  
**Page :** `/admin/governance/rbac`  
**Statut :** Implémentation UI complète, backend à développer

---

## 1. MODÈLE DE PERMISSIONS

| Élément | Cahier | Implémentation | Statut |
|---------|--------|----------------|--------|
| **Ressources** : Parcels, Offers, Contracts, Trucks, Users, Financial_Transactions, System_Config | Oui | ✅ Exact match dans rbacStore.ts | OK |
| **Actions** : create, read, update, delete, approve, export, assign | Oui | ✅ Exact match dans rbacStore.ts | OK |
| **Scopes** : Own, Team, Region, Global | Oui | ✅ Exact match dans rbacStore.ts | OK |

---

## 2. FONCTIONNALITÉS

### 2.1 Matrix de permissions visuelle (tableau Excel-like)

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Lignes : Rôles (Admin, Ops, Support, Auditor, Country_Manager) | Oui | ⚠️ Admin, Ops Manager, Auditor présents. Manque : Support, Country_Manager | Partiel |
| Colonnes : Ressources + Actions | Oui | ✅ Tableau avec ressources en lignes, actions en colonnes | OK |
| Cases à cocher | Oui | ✅ Toggles cliquables (Check/Lock icons) | OK |
| Héritage (Admin hérite de tout, Support lecture seule) | Oui | ⚠️ Légende "Inherited" affichée, pas d'héritage automatique visible | À implémenter |
| Scope par ressource (Own, Team, Region, Global) | Oui | ✅ Sélecteur de scope pour chaque ressource | OK |

### 2.2 Gestion des rôles personnalisés

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Création rôle personnalisé (ex: "Support Logistique Côte d'Ivoire") | Oui | ⚠️ Bouton "New Role", `addRole` dans store, pas de modale de création | À implémenter |
| Simulation mode "Voir comme..." (impersonate) | Oui | ✅ Bouton "Simulator Mode" appelle `setImpersonation` | OK |
| Arbre de navigation montrant pages accessibles par rôle | Oui | ❌ Non implémenté | Manquant |

### 2.3 Audit des accès

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Qui a eu accès à quelle ressource et quand | Oui | ✅ Onglet "Access Audit Logs" avec tableau détaillé | OK |
| Détection d'accès anormaux (ex: Support → Financial_Transactions) | Oui | ✅ Exemple dans auditLogs : status "denied" + metadata.reason | OK |
| Timestamp, operator, action, resource, status | Oui | ✅ Colonnes complètes dans le tableau | OK |

---

## 3. STACK TECHNIQUE

| Technologie | Cahier | Implémentation | Statut |
|-------------|--------|----------------|--------|
| CASL.js pour définition permissions côté client | Oui | ⚠️ Installé (@casl/ability, @casl/react) mais non utilisé | À brancher |
| Middleware NestJS @Permissions() avec decorators | Oui | ❌ Pas de service RBAC backend trouvé | Manquant |
| PostgreSQL : table RolePermission avec JSONB pour scopes dynamiques | Oui | ❌ Non visible | Manquant |
| Cache Redis des permissions utilisateur (TTL 1h) | Oui | ⚠️ Mention UI "cached in Redis with 1h TTL", pas d'implémentation | Mock |

---

## 4. UI/UX

| Critère | Cahier | Implémentation | Statut |
|---------|--------|----------------|--------|
| Arbre de navigation montrant pages accessibles par rôle sélectionné | Oui | ❌ Non implémenté | Manquant |
| Avertissement rouge si modification risquée | Oui | ✅ "Warning: Risky modifications detected" + "requires Admin 2FA" | OK |
| Tableau Excel-like avec scroll | Oui | ✅ Table avec sticky header, scrollable | OK |
| Onglets Matrix / Audit | Implicite | ✅ Onglets "Permissions Matrix" / "Access Audit Logs" | OK |

---

## 5. DONNÉES & STORE (rbacStore.ts)

- ✅ Structure Role avec permissions[], isSystem, inheritedFrom
- ✅ Permission avec resource, actions[], scope
- ✅ AuditLog avec userId, action, resource, status, metadata
- ✅ Actions : selectRole, updatePermission, updateScope, addRole, setImpersonation
- ⚠️ 3 rôles mockés (Admin, Ops Manager, Auditor) - manque Support, Country_Manager
- ⚠️ 1 audit log mocké
- ❌ Pas d'appel API backend

---

## 6. ACTIONS PRIORITAIRES

### Court terme (UI/UX)

1. **Ajouter rôles manquants** : Support, Country_Manager dans le store
2. **Modale "New Role"** : formulaire pour créer un rôle personnalisé (nom, description, permissions initiales)
3. **Arbre de navigation** : afficher les pages accessibles par le rôle sélectionné (basé sur permissions)

### Moyen terme (Intégration CASL.js)

4. **Brancher CASL.js** : définir AbilityBuilder basé sur les permissions du rôle
5. **Hook useAbility** : wrapper pour vérifier permissions côté client
6. **Protéger composants** : utiliser `<Can>` de @casl/react pour afficher/masquer selon permissions

### Long terme (Backend)

7. **Service RBAC NestJS** : CRUD rôles, permissions, audit
8. **Middleware @Permissions()** : decorator pour protéger endpoints
9. **PostgreSQL** : table `role_permissions` avec JSONB pour scopes dynamiques
10. **Cache Redis** : mise en cache des permissions utilisateur (TTL 1h)
11. **API audit** : POST /api/v1/admin/rbac/audit pour logger les accès

---

## 7. EXEMPLE RÔLE PERSONNALISÉ (Cahier des charges)

**"Support Logistique Côte d'Ivoire"** :
- Accès uniquement missions CI : `{ resource: 'Trucks', actions: ['read'], scope: 'Region' }`
- Lecture seule finances : `{ resource: 'Financial_Transactions', actions: ['read'], scope: 'Region' }`

**Implémentation suggérée** :
```typescript
{
  id: 'role-support-ci',
  name: 'Support Logistique CI',
  description: 'Support logistique limité à la Côte d\'Ivoire, lecture seule finances',
  permissions: [
    { resource: 'Trucks', actions: ['read', 'update'], scope: 'Region' },
    { resource: 'Financial_Transactions', actions: ['read'], scope: 'Region' },
    { resource: 'Contracts', actions: ['read'], scope: 'Region' },
  ],
}
```

---

## 8. CONFORMITÉ GLOBALE

| Catégorie | Conformité | Notes |
|-----------|------------|-------|
| **Modèle de données** | 100% | Ressources, Actions, Scopes conformes |
| **UI Matrix** | 90% | Tableau fonctionnel, manque héritage visuel |
| **Rôles personnalisés** | 40% | Bouton présent, pas de modale de création |
| **Impersonation** | 70% | Bouton fonctionnel, manque arbre de navigation |
| **Audit** | 80% | Tableau complet, données mockées |
| **Stack technique** | 30% | CASL.js non branché, backend manquant |

**Score global : 68% conforme**

L'interface RBAC couvre les fonctionnalités principales du cahier des charges. Le modèle de données est conforme. Les principales améliorations à apporter sont :
1. Intégration CASL.js pour la logique de permissions
2. Backend NestJS avec middleware @Permissions()
3. Arbre de navigation pour l'impersonation
4. Modale de création de rôles personnalisés
