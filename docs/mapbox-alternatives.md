# ðŸ—ºï¸ Alternatives Gratuites à Mapbox

## Options Open Source

### 1. **Leaflet** âœ… RECOMMANDÉ
- **100% Gratuit** et Open Source
- **Aucune clé API** requise
- Très léger (~40KB)
- Grande communauté
- Plugins nombreux

**Installation**:
```bash
npm install leaflet react-leaflet @types/leaflet
```

**Composants créés**:
- `FarmMapLeaflet.tsx` - Carte ferme
- `DeliveryMapLeaflet.tsx` - Tracking livraisons

**Tuiles gratuites**:
- OpenStreetMap (rue)
- Esri Satellite (satellite)
- Stamen (design)
- CartoDB (minimaliste)

### 2. **OpenLayers**
- Open source
- Plus complexe que Leaflet
- Très puissant
- Gratuit

### 3. **MapLibre GL**
- Fork open source de Mapbox GL
- Compatible avec style Mapbox
- Gratuit
- Moderne

## Comparaison

| Feature | Mapbox | Leaflet | OpenLayers | MapLibre |
|---------|--------|---------|------------|----------|
| **Prix** | Payant* | Gratuit | Gratuit | Gratuit |
| **API Key** | Oui | Non | Non | Non |
| **Facilité** | â­â­â­â­ | â­â­â­â­â­ | â­â­â­ | â­â­â­â­ |
| **Performance** | â­â­â­â­â­ | â­â­â­â­ | â­â­â­â­ | â­â­â­â­â­ |
| **3D** | Oui | Non | Oui | Oui |
| **Satellite** | Oui | Oui** | Oui** | Oui** |

*Mapbox: 50,000 vues gratuites/mois  
**Via tuiles tierces gratuites

## Recommandation pour AgriLogistic

**Utilisez Leaflet** car:
1. âœ… Totalement gratuit
2. âœ… Pas de limite d'utilisation
3. âœ… Facile à utiliser
4. âœ… Tuiles satellite gratuites (Esri)
5. âœ… Parfait pour agriculture

## Sources de Tuiles Gratuites

### Satellite
```typescript
// Esri World Imagery (gratuit)
url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

// Google Satellite (usage limité)
url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
```

### Rue
```typescript
// OpenStreetMap (gratuit)
url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

// CartoDB (gratuit)
url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
```

### Topographique
```typescript
// OpenTopoMap (gratuit)
url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
```

## Migration Mapbox â†’ Leaflet

**Avant (Mapbox)**:
```typescript
import Map from 'react-map-gl';
<Map mapboxAccessToken={token} />
```

**Après (Leaflet)**:
```typescript
import { MapContainer } from 'react-leaflet';
<MapContainer center={[lat, lng]} zoom={14} />
```

## Avantages Leaflet pour Agriculture

1. **Pas de coûts** - Idéal pour MVP
2. **Offline capable** - Peut cacher tuiles
3. **Polygones faciles** - Pour champs
4. **Markers custom** - Pour capteurs IoT
5. **Plugins** - Heatmaps, clusters, etc.

## Utilisation dans AgriLogistic

Remplacez simplement:
- `FarmMapInteractive` â†’ `FarmMapLeaflet`
- `DeliveryMap` â†’ `DeliveryMapLeaflet`

**Aucune autre modification nécessaire!**


