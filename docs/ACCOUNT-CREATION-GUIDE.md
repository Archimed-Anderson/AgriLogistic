# Guide de Création de Comptes Utilisateurs - AgroLogistic

## Vue d'Ensemble

AgroLogistic supporte quatre types de comptes utilisateurs, chacun avec des permissions et fonctionnalités spécifiques :

| Rôle | Description | Permissions Clés |
|------|-------------|------------------|
| **Admin** | Gestionnaire de la plateforme | Accès complet, gestion des utilisateurs, rapports |
| **Farmer** (Agriculteur) | Vendeur de produits agricoles | Gestion des produits, ventes, analytics |
| **Buyer** (Acheteur) | Acheteur de produits | Marketplace, commandes, suivi |
| **Transporter** | Prestataire logistique | Gestion des livraisons, tracking |

---

## Prérequis

### Pour tous les comptes
- Email valide et unique
- Mot de passe respectant les critères de sécurité :
  - Minimum 8 caractères
  - Au moins une majuscule
  - Au moins une minuscule
  - Au moins un chiffre
  - Au moins un caractère spécial (!@#$%^&*)
- Numéro de téléphone valide (format français ou international)
- Acceptation des conditions d'utilisation

### Spécifique par rôle

#### Agriculteur (Farmer)
- Taille de l'exploitation (en hectares)
- Spécialisation agricole (optionnel)
- Type d'entreprise

#### Transporteur
- Spécialisation logistique
- Type d'entreprise

#### Administrateur
- Validation manuelle requise par l'équipe AgroLogistic

---

## Étapes de Création de Compte

### Étape 1 : Sélection du Type de Compte

1. Accéder à la page d'inscription : `/auth`
2. Cliquer sur l'onglet "Inscription"
3. Sélectionner le type de compte approprié parmi :
   - 🌾 **Agriculteur** - Pour les producteurs
   - 🛒 **Acheteur** - Pour les acheteurs
   - 🚚 **Transporteur** - Pour les prestataires logistiques
   - 🛡️ **Administrateur** - Pour les gestionnaires (validation requise)

### Étape 2 : Informations Personnelles

Remplir les champs suivants :

| Champ | Requis | Format |
|-------|--------|--------|
| Prénom | ✅ | Min. 2 caractères, lettres uniquement |
| Nom | ✅ | Min. 2 caractères, lettres uniquement |
| Email | ✅ | format@email.com |
| Téléphone | ✅ | +33XXXXXXXXX ou 0XXXXXXXXX |
| Mot de passe | ✅ | Voir critères ci-dessus |
| Confirmation | ✅ | Identique au mot de passe |

### Étape 3 : Informations Professionnelles

**Pour les Agriculteurs :**
- Type d'entreprise (Individuel, Exploitation familiale, Coopérative, etc.)
- Taille de l'exploitation en hectares
- Spécialisation (Céréales, Légumes, Fruits, Élevage, etc.)

**Pour les Transporteurs :**
- Type d'entreprise
- Spécialisation logistique (Frigorifique, Marchandises sèches, Vrac, etc.)

**Pour les Acheteurs :**
- Type d'entreprise (optionnel)

### Étape 4 : Finalisation

1. Vérifier le récapitulatif des informations
2. Cocher l'acceptation des conditions d'utilisation ✅
3. Optionnel : S'inscrire à la newsletter
4. Cliquer sur "Créer mon compte"

---

## Messages d'Erreur et Résolutions

### Erreurs de Formulaire

| Message | Cause | Solution |
|---------|-------|----------|
| "L'email est requis" | Champ email vide | Saisir une adresse email valide |
| "Format d'email invalide" | Email mal formaté | Vérifier le format (exemple@domaine.com) |
| "Un compte avec cet email existe déjà" | Email déjà enregistré | Utiliser un autre email ou se connecter |
| "Minimum 8 caractères" | Mot de passe trop court | Allonger le mot de passe |
| "Au moins une majuscule requise" | Pas de majuscule | Ajouter une lettre majuscule |
| "Les mots de passe ne correspondent pas" | Confirmation différente | Ressaisir la confirmation |
| "Format de téléphone invalide" | Numéro mal formaté | Format: +33612345678 ou 0612345678 |
| "La taille de l'exploitation est requise" | Champ vide (Farmer) | Saisir la surface en hectares |

### Erreurs Serveur

| Code | Message | Solution |
|------|---------|----------|
| 500 | "Erreur serveur" | Réessayer plus tard, contacter le support |
| 503 | "Service indisponible" | Le service est en maintenance |
| 429 | "Trop de tentatives" | Attendre quelques minutes avant de réessayer |

---

## Comptes de Démonstration

Pour tester l'application, utilisez les comptes suivants :

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@AgroLogistic.com | admin123 | Administrateur |
| farmer@AgroLogistic.com | farmer123 | Agriculteur |
| buyer@AgroLogistic.com | buyer123 | Acheteur |
| transporter@AgroLogistic.com | transporter123 | Transporteur |
| demo@AgroLogistic.com | (n'importe quel mot de passe) | Démo (Admin) |

---

## API de Création de Compte

### Endpoint
```
POST /api/v1/auth/register
```

### Body (JSON)
```json
{
  "email": "utilisateur@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+33612345678",
  "accountType": "farmer",
  "businessType": "family_farm",
  "farmSize": 50,
  "farmerSpecialization": "cereals",
  "acceptTerms": true,
  "newsletterSubscribed": false
}
```

### Valeurs possibles

**accountType**
- `admin` - Administrateur
- `farmer` - Agriculteur
- `buyer` - Acheteur
- `transporter` - Transporteur

**businessType**
- `individual` - Entrepreneur Individuel
- `family_farm` - Exploitation Familiale
- `cooperative` - Coopérative Agricole
- `sarl` - SARL
- `sas` - SAS
- `sa` - Société Anonyme
- `other` - Autre

**farmerSpecialization**
- `cereals`, `vegetables`, `fruits`, `livestock`, `dairy`
- `viticulture`, `organic`, `poultry`, `mixed`, `other`

**logisticsSpecialization**
- `refrigerated`, `dry_goods`, `bulk`, `perishables`
- `hazmat`, `livestock_transport`, `multimodal`, `other`

### Réponse Succès (201)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "utilisateur@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "farmer"
  }
}
```

### Réponse Erreur (400/409)
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Un compte avec cet email existe déjà"
  }
}
```

---

## Sécurité

### Mesures de Protection

1. **Hachage des mots de passe** : Les mots de passe sont hachés côté client (SHA-256) avant envoi et re-hachés côté serveur (bcrypt)

2. **Protection CSRF** : Tokens CSRF automatiquement gérés

3. **Validation côté serveur** : Toutes les entrées sont validées

4. **Rate Limiting** : Limite de tentatives d'inscription par IP

5. **Email Verification** : Un email de vérification est envoyé après l'inscription

### Recommandations
- Utilisez un mot de passe unique pour AgroLogistic
- Ne partagez jamais vos identifiants
- Déconnectez-vous sur les appareils partagés
- Activez la vérification email

---

## Support

En cas de problème lors de la création de compte :

- 📧 Email : support@AgroLogistic.com
- 📞 Téléphone : +33 1 23 45 67 89
- 💬 Chat en ligne : Disponible 9h-18h (jours ouvrés)

---

*Dernière mise à jour : Janvier 2026*
