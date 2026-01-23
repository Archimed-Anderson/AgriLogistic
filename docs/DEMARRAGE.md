# 🚀 Démarrage de l'Application

## Commandes de Lancement

### Développement
```powershell
# Démarrer le serveur de développement
npm run dev

# L'application sera disponible sur:
# http://localhost:3000
```

### Production
```powershell
# Build pour production
npm run build

# Démarrer en mode production
npm start
```

### Tests
```powershell
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e
```

## Pages Disponibles

Une fois l'application lancée, accédez à:

- **Dashboard**: http://localhost:3000/dashboard
- **Farm Operations**: http://localhost:3000/farm/operations
- **Marketplace Pro**: http://localhost:3000/marketplace/pro
- **Rental Manager**: http://localhost:3000/rental/manager
- **Logistics Hub**: http://localhost:3000/logistics/hub

## Nouvelles Fonctionnalités Activées

✅ **API Integration Layer**
- Client axios configuré
- Endpoints pour tous les services
- Gestion d'erreurs et auth

✅ **Cartes Leaflet (Gratuit)**
- FarmMapLeaflet - Carte ferme interactive
- DeliveryMapLeaflet - Tracking livraisons
- Aucune clé API nécessaire

✅ **Offline Mode**
- IndexedDB pour stockage local
- Service Worker pour cache
- Sync automatique

✅ **WebSocket**
- Client temps réel
- Reconnexion automatique
- Channels multiples

✅ **Tests**
- Suite Vitest configurée
- Tests Playwright E2E
- Coverage reporting

## Dépannage

### Port déjà utilisé
```powershell
# Changer le port
$env:PORT=3001; npm run dev
```

### Erreurs de build
```powershell
# Nettoyer et réinstaller
Remove-Item -Recurse -Force .next, node_modules
npm install
npm run dev
```

### Variables d'environnement
Créez `.env.local` avec:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## Prochaines Étapes

1. ✅ Application lancée
2. ⏳ Tester les pages
3. ⏳ Vérifier les cartes Leaflet
4. ⏳ Connecter aux APIs réelles
5. ⏳ Déployer en staging
