# 🎫 Audit Support Client & Gestion des Litiges - Cahier des Charges

**Date :** 1er Février 2025  
**Page :** `/admin/support`  
**Statut :** Implémentation UI avancée, backend et intégrations à développer

---

## 1. CONTEXTE

| Élément | Cahier | Implémentation | Statut |
|---------|--------|----------------|--------|
| Centre support intégré | Oui | ✅ Page Support Center avec inbox + conversation | OK |
| Gestion litiges entre acteurs | Agriculteur vs acheteur, etc. | ✅ Module Litiges avec disputeData (involvedParties, Farmer/Buyer) | OK |

---

## 2. FONCTIONNALITÉS TICKETING (type Zendesk)

### 2.1 File d'attente par priorité

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| P0 (bloquant business) | Oui | ✅ TicketPriority P0, badge rouge, indicateur pulse | OK |
| P1 (retard) | Oui | ✅ TicketPriority P1, badge amber | OK |
| P2 (question) | Oui | ✅ TicketPriority P2, badge bleu | OK |
| Filtre par priorité | Implicite | ⚠️ Store `filter.priority` existe, non utilisé dans l'UI | À brancher |
| Badge nombre P0 | Implicite | ✅ Affichage "X P0" dans header inbox | OK |

### 2.2 Assignation automatique

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Selon langue | Oui | ❌ Non implémenté | Manquant |
| Selon spécialité (Tech, Finance, Logistique) | Oui | ⚠️ TicketType: General, Finance, Logistics, Technical, Dispute. `assignTicket` dans store, pas d'UI assignation ni logique auto | Partiel |
| UI assignation agent | Implicite | ❌ Pas de dropdown/select pour assigner un agent | Manquant |

### 2.3 Vue conversationnelle

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Chat centralisé | Oui | ✅ Interface chat stream-like avec messages client/agent/system | OK |
| Email centralisé | Oui | ❌ Pas d'affichage emails dans le flux | Manquant |
| WhatsApp Business centralisé | Oui | ❌ Pas d'intégration visible | Manquant |
| Types de messages | Implicite | ✅ client, agent, system, internal (store) | OK |
| Input réponse + envoi | Oui | ✅ Zone de saisie + Send + Paperclip | OK |
| Pièces jointes (Paperclip) | Implicite | ✅ Icône présente, non fonctionnelle | Placeholder |

---

## 3. MODULE LITIGES SPÉCIFIQUE

### 3.1 Types de litiges

| Type Cahier | Implémentation | Statut |
|-------------|----------------|--------|
| Non-paiement | ⚠️ Exemple ticket "Paiement non reçu" mais pas de champ `disputeType` | Partiel |
| Qualité non conforme | ❌ Non modélisé | Manquant |
| Retard livraison | ⚠️ Ticket Logistics "Retard livraison" existe, pas dans module Dispute | Partiel |
| Fraude documentaire | ❌ Non modélisé | Manquant |

**Recommandation :** Ajouter `disputeType?: 'non_payment' | 'quality_dispute' | 'delivery_delay' | 'document_fraud'` dans `disputeData`.

### 3.2 Workflow litige

| Étape Cahier | Implémentation | Statut |
|--------------|----------------|--------|
| Ouverture | ✅ DisputeStage.Opening | OK |
| Médiation | ✅ DisputeStage.Mediation | OK |
| Arbitrage Admin | ✅ DisputeStage.Arbitration | OK |
| Résolution | ⚠️ DisputeStage.Resolution dans store, non affiché dans la timeline UI (4 cercles au lieu de 5) | Partiel |
| Clôture | ✅ DisputeStage.Closed | OK |
| Timeline visuelle | Oui | ✅ 4 étapes avec indicateur actif | OK |
| Changement de stage | Implicite | ⚠️ `updateDisputeStage` dans store, pas de UI pour faire avancer le stage | À brancher |

### 3.3 Gestion preuves

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Upload photos | Oui | ⚠️ Evidence Vault avec liste, type "Receipt", bouton "Add Evidence" non fonctionnel | Placeholder |
| Signatures numériques | Oui | ❌ Non implémenté | Manquant |
| Données IoT (température transport) | Oui | ⚠️ disputeData.iotDataRef, UI "Transport IoT: Stable Temp (4°C)" en dur | Mock |
| Affichage preuves existantes | Oui | ✅ Grid evidence avec type + description | OK |

### 3.4 Calcul automatique compensation

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Basé sur Smart Contract terms | Oui | ⚠️ disputeData.suggestedCompensation, bouton "Payout Claim - Smart Contract Auto" | Placeholder |
| Bouton Payout Claim | Implicite | ✅ Présent | OK |
| Bouton Reject Claim | Implicite | ✅ Présent avec "Requires Justification" | OK |

---

## 4. OUTILS AGENT

| Outil | Cahier | Implémentation | Statut |
|-------|--------|----------------|--------|
| **"Voir la transaction"** : Vue consolidée offre, paiement, tracking | Oui | ✅ Section "Context Deep-Link" : Contract Value, Farmer Status, Transport IoT, bouton "View Deal" | OK |
| **"Simulation résolution"** : Calcul impact financier avant décision | Oui | ✅ Bloc "Resolution Simulator" : "Impact analysis: -2% Trust Score for Buyer #B112" | OK |
| **Notes internes** (non visibles clients) | Oui | ✅ Lien "Internal Note (Hidden)" dans footer conversation | OK |
| Suggestion réponse IA | Implicite | ✅ Lien "Suggest AI Answer" présent, non fonctionnel | Placeholder |

---

## 5. SLA MONITORING

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Compteur temps de réponse affiché | Oui | ✅ SLA affiché en header (heure limite), rouge si dépassé | OK |
| Objectif &lt; 2h pour P0 | Oui | ⚠️ slaLimit défini par ticket, pas de mention explicite "2h" | OK |
| Alertes si ticket non assigné depuis 30 min | Oui | ❌ Non implémenté | Manquant |
| Stats SLA globales | Implicite | ✅ "Avg Response 1h 12m", "SLA Compliance 91%" | OK |

---

## 6. STACK TECHNIQUE

| Technologie | Cahier | Implémentation | Statut |
|-------------|--------|----------------|--------|
| Frontend : React composants chat stream-like | Oui | ✅ Interface conversationnelle avec ScrollArea, messages bulles | OK |
| Backend : NestJS + MongoDB | Oui | ❌ Pas de service Support/Litiges, store Zustand mock | Manquant |
| Intégration Twilio (SMS/WhatsApp) | Oui | ❌ Pas d'intégration Support (Twilio existe ailleurs pour notifications) | Manquant |
| IA : Classification priorité ticket (NLP) | Oui | ⚠️ Section "AI Classification Feed" avec exemples mock | Placeholder |
| IA : Suggestion réponse basée sur historique | Oui | ⚠️ Lien "Suggest AI Answer" | Placeholder |
| Blockchain : Archivage décisions litige | Oui | ⚠️ disputeData.blockchainRef présent, pas d'archivage réel | Mock |

---

## 7. RAPPORTS

| Rapport | Cahier | Implémentation | Statut |
|---------|--------|----------------|--------|
| Taux satisfaction (CSAT) par catégorie | Oui | ⚠️ CSAT global affiché (4.8/5, 96%), pas par catégorie | Partiel |
| Temps moyen résolution (MTTR) | Oui | ✅ ProgressStat "MTTR (Resolution)" 84%, "Goal: < 24h" | OK |
| Agriculteurs à risque (trop de litiges ouverts) | Oui | ❌ Non implémenté | Manquant |
| Export UEMOA | Implicite | ✅ Bouton "UEMOA Report Engine - Generate Regulatory Compliance Export" | Placeholder |

---

## 8. DONNÉES & STORE (supportStore.ts)

### 8.1 Structure SupportTicket

- ✅ id, subject, description, priority, status, type
- ✅ createdAt, updatedAt, clientId, clientName, agentId
- ✅ messages[], slaLimit, category
- ✅ disputeData?: { stage, involvedParties, claimAmount, suggestedCompensation, evidence[], iotDataRef, blockchainRef }
- ⚠️ Manque : disputeType (sous-type litige), channel (email/chat/whatsapp), langue

### 8.2 Actions store

- ✅ selectTicket, setFilter, addMessage
- ✅ updateTicketStatus, updateDisputeStage, assignTicket
- ⚠️ Filtre par type non utilisé dans filteredTickets (page)

### 8.3 Tickets mockés

- 2 tickets : 1 Dispute (P0), 1 Logistics (P1)
- Messages et disputeData cohérents

---

## 9. UI/UX IMPLÉMENTÉE

| Élément | Statut |
|---------|--------|
| HUD Stats (P0 Tickets, Avg Response, Active Disputes, CSAT) | ✅ |
| Sidebar Inbox avec filtres status (all, open, pending, resolved) | ✅ |
| Liste tickets avec priorité, sujet, client, horaire | ✅ |
| Vue conversation avec messages client/agent/system | ✅ |
| Header ticket : sujet, client, SLA, select status | ✅ |
| Zone réponse + Paperclip + Send | ✅ |
| Panel Litiges : Arbitration Module, workflow 4 étapes | ✅ |
| Context Deep-Link (Contract Value, Farmer, IoT) | ✅ |
| Evidence Vault + Add Evidence | ✅ |
| Boutons Payout Claim / Reject Claim | ✅ |
| Resolution Simulator | ✅ |
| Panel non-Dispute : Global Service Health (CSAT, MTTR, SLA) | ✅ |
| AI Classification Feed (mock) | ✅ |
| Bouton UEMOA Report Export | ✅ |
| Internal Note / Suggest AI Answer | ✅ |

---

## 10. ACTIONS PRIORITAIRES

### Court terme (UI/UX)

1. **Filtre par priorité** : Brancher `filter.priority` dans l'UI (tabs P0/P1/P2 ou dropdown)
2. **Filtre par type** : Ajouter filtre Tech, Finance, Logistique, Dispute
3. **Assignation agent** : Dropdown/select pour assigner un ticket à un agent
4. **Workflow stage** : Boutons ou stepper pour faire avancer le litige (Mediation → Arbitration → Resolution → Closed)
5. **Types litiges** : Ajouter `disputeType` et afficher badge (Non-paiement, Qualité, Retard, Fraude)
6. **Résolution dans timeline** : Afficher 5 étapes (incl. Resolution) ou fusionner Resolution/Closed selon choix métier

### Moyen terme (Fonctionnel)

7. **Upload preuves** : Implémenter upload photos/documents dans Evidence Vault
8. **Notes internes** : Modale ou zone pour saisir notes internes (type: internal)
9. **Simulation résolution** : Calcul réel impact (Trust Score, compensation) avant validation
10. **Voir la transaction** : Lien vers page détail offre/contrat/tracking
11. **Suggest AI Answer** : Appel API ou mock pour suggestion réponse
12. **Alerte ticket non assigné 30 min** : Badge ou bandeau si `!agentId && createdAt < 30min`

### Long terme (Backend & Intégrations)

13. **Service Support NestJS** :
    - CRUD tickets, messages
    - Assignation automatique par langue + spécialité
    - Endpoints : GET/POST /support/tickets, POST /support/tickets/:id/messages
14. **MongoDB** : Schéma tickets flexible (conversations, attachments, metadata)
15. **Twilio** : Intégration SMS/WhatsApp pour canaux conversation
16. **IA NLP** : Classification priorité + suggestion réponse (service Python ou NestJS)
17. **Blockchain** : Archivage hash décision litige (Hyperledger)
18. **Rapports** :
    - CSAT par catégorie
    - Liste agriculteurs à risque (nombre litiges ouverts)
    - Export PDF/CSV UEMOA

---

## 11. CONFORMITÉ GLOBALE

| Catégorie | Conformité | Notes |
|-----------|------------|-------|
| **Ticketing Zendesk** | 75% | Priorités OK, assignation manquante, vue chat OK, email/WhatsApp absents |
| **Module Litiges** | 70% | Workflow OK, types partiels, preuves mock, compensation placeholder |
| **Outils agent** | 85% | Voir transaction, simulation, notes internes présents |
| **SLA Monitoring** | 80% | Compteur OK, alerte 30 min manquante |
| **Stack technique** | 40% | Frontend OK, backend/IA/Blockchain mock |
| **Rapports** | 50% | CSAT/MTTR OK, agriculteurs à risque absent |

**Score global : 67% conforme**

---

## 12. RÉSUMÉ EXÉCUTIF

L'interface Support & Litiges couvre les fonctionnalités principales du cahier des charges :

**Points forts :**
- Interface type Zendesk avec file d'attente par priorité (P0/P1/P2)
- Vue conversationnelle chat stream-like
- Module Litiges dédié avec workflow (Ouverture → Médiation → Arbitrage → Clôture)
- Outils agent : Voir transaction, Simulation résolution, Notes internes
- SLA affiché avec seuil rouge si dépassé
- Rapports CSAT et MTTR

**À renforcer :**
- Assignation automatique selon langue/spécialité
- Intégration email/WhatsApp dans le flux
- Types litiges (Non-paiement, Qualité, Retard, Fraude)
- Upload preuves et signatures numériques
- Alerte ticket non assigné 30 min
- Rapport agriculteurs à risque
- Backend NestJS + MongoDB
- Intégrations Twilio, IA NLP, Blockchain

**Prochaine étape recommandée :** Brancher les filtres (priorité, type), ajouter l'UI d'assignation agent, puis créer le service NestJS Support avec MongoDB.
