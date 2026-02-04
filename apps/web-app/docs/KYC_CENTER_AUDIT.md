# 📋 Audit KYC Validation Center - Cahier des Charges

**Date :** 1er Février 2025  
**Page :** `/admin/governance/kyc`  
**Statut :** Implémentation partielle (UI mockée)

---

## 1. WORKFLOW MÉTIER

| Étape | Cahier | Implémentation | Statut |
|-------|--------|----------------|--------|
| Upload documents | Oui | ❌ Non visible | Manquant |
| OCR automatique (Tesseract/AWS Textract) | Oui | ⚠️ UI seulement (affichage score) | Mock |
| Vérification API gouvernementale (API identité CI) | Oui | ❌ Non implémenté | Manquant |
| Validation humaine finale | Oui | ✅ Boutons Approuver/Rejeter | OK |
| Notarisation blockchain | Oui | ⚠️ Badge "Blockchain Verified" en UI | Mock |

---

## 2. FONCTIONNALITÉS

### 2.1 File d'attente visuelle (Kanban board)

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Colonnes : Documents reçus → En vérification → Validation auto → Validation manuelle → Approuvé | Oui | ✅ 5 colonnes | OK |
| Colonne Rejeté | Oui | ✅ Colonne Kanban "Rejeté" ajoutée | OK |
| Badges par type : Agriculteur (15), Transporteur (5), Acheteur (3), Cooperatives (2) | Oui | ✅ Badges dynamiques par type | OK |
| Typo colonne "Maunual Review" | - | ✅ Corrigé → "Validation Manuelle" | OK |

### 2.2 Vue détaillée de dossier

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Split-screen : Document scanné (PDF) \| Données extraites (JSON éditable) | Oui | ✅ Split-screen présent | OK |
| Preview PDF avec React-PDF | Oui | ❌ HTML mock (simulation carte CI) | À migrer React-PDF |
| JSON éditable | Oui | ⚠️ Affichage key-value, bouton "Edit Payload" non fonctionnel | À implémenter |
| Vérification croisée : Photo selfie vs Photo ID (FaceMatch AWS Rekognition) | Oui | ⚠️ Score FaceMatch affiché (94%) | Mock |
| Score de confiance OCR (0-100%) | Oui | ✅ ocrConfidence dans store, affiché en overlay (98%) | OK |
| Historique des vérifications précédentes | Oui | ❌ Non visible | Manquant |

### 2.3 Automatisations

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Rejet auto si document expiré > 6 mois | Oui | ❌ Non implémenté | Manquant |
| Rappel automatique WhatsApp/SMS après 48h sans réponse | Oui | ❌ Non implémenté | Manquant |
| Batch validation coopératives (valider 50 agriculteurs d'un coup) | Oui | ✅ Bouton "Batch Validation" appelle `batchApprove` pour dossiers en validation manuelle | OK |

---

## 3. STACK TECHNIQUE

| Technologie | Cahier | Implémentation | Statut |
|-------------|--------|----------------|--------|
| React-PDF pour preview | Oui | ❌ Non installé, preview HTML mock | À ajouter |
| React-Leaflet pour adresse géocodée | Oui | ✅ Dépendance présente, non utilisée sur KYC | À brancher |
| NestJS + BullMQ traitement asynchrone | Oui | ❌ Pas de service KYC NestJS/BullMQ | Manquant |
| IA Python : OpenCV, TensorFlow détection fraudes | Oui | ❌ Non implémenté | Manquant |
| Hyperledger Fabric timestamp validation | Oui | ⚠️ blockchain-service existe, pas d'intégration KYC | À brancher |

---

## 4. SPÉCIFICITÉS RÉGIONALES

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Documents OHADA : RCCM, Attestation Fiscale, Carte CEMAC | Oui | ⚠️ RCCM, "Identité Nationale (CI)" dans mock | Partiel |
| Vérification Mobile Money (Orange Money, Wave, M-Pesa) | Oui | ✅ mobileMoneyVerified + vérification affichée | OK (mock) |
| Multi-langue : Français, Anglais, Portugais | Oui | ⚠️ UI en français uniquement | À étendre |

---

## 5. SÉCURITÉ

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Chiffrement AES-256 documents au repos (MinIO) | Oui | ❌ Non visible | Manquant |
| Logs immutables des accès (qui a vu quel document) | Oui | ❌ Non implémenté | Manquant |
| Droit à l'oubli RGPD (anonymisation après 5 ans) | Oui | ❌ Non implémenté | Manquant |

---

## 6. DONNÉES & STORE (kycStore.ts)

- ✅ Structure KycApplication avec actorType, documents, faceMatchScore, ocrConfidence
- ✅ KycStatus : received, verifying, auto_fix, manual_review, approved, rejected
- ✅ ActorType : farmer, transporter, buyer, cooperative
- ✅ Données mockées (3 applications)
- ❌ Pas d'appel API backend
- ✅ Filtre "Acheteurs" ajouté dans les filtres header

---

## 7. ACTIONS PRIORITAIRES

### Court terme (UI/UX) ✅ Corrigés

1. ~~Corriger typo "Maunual" → "Manual"~~ ✅
2. ~~Ajouter colonne Kanban "Rejeté"~~ ✅
3. ~~Ajouter filtre "Acheteur" dans les filtres header~~ ✅
4. Remplacer preview HTML par React-PDF (si documents PDF disponibles)

### Moyen terme (Backend)

5. Créer service KYC NestJS avec BullMQ (upload, OCR, queue)
6. Implémenter batch validation UI (sélection multiple + validation groupe)
7. Brancher React-Leaflet pour vérification adresse géocodée

### Long terme (Conformité)

8. Intégration OCR (Tesseract/AWS Textract), FaceMatch (AWS Rekognition)
9. Notarisation blockchain (Hyperledger)
10. Automatisations : rejet doc expiré, rappels WhatsApp/SMS
11. Sécurité : AES-256, logs accès, RGPD droit à l'oubli
