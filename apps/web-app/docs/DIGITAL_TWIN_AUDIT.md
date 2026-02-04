# Digital Twin Global (Vue Satellite) - Audit Cahier des Charges

**Date :** 1er Février 2025  
**Page :** `/admin/digital-twin`  
**Statut :** Implémentation UI avancée, couches et backend à développer

---

## 1. CONTEXTE

| Élément | Cahier | Implémentation | Statut |
|---------|--------|----------------|--------|
| Agrégation Sentinel-2/Landsat (NDVI) | Oui | ⚠️ NDVI mentionné, overlay simulé (OSM + filtre CSS hue-rotate), pas de vraies tuiles Sentinel | Mock |
| IoT capteurs sol | Oui | ⚠️ "Soil Moisture Index (IoT)" affiché en dur dans Parcel Inspector | Mock |
| Prédictions ML | Oui | ✅ Parcel Inspector : "AI Prediction Node", predictedYield, Harvest window | OK |
| Vue macro santé cultures | Oui | ✅ Regional Forecast avec regionStats (Avg Yield, Surface, riskLevel) | OK |
| Anticipation récoltes et crises | Oui | ⚠️ riskLevel (low/high) présent, pas de vue crise alimentaire dédiée | Partiel |

---

## 2. CARTographie MULTI-COUCHES

### 2.1 Couche NDVI

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Indice végétation | Oui | ✅ Couche "NDVI Index" avec toggle | OK |
| Légende colorée (rouge=stress, vert=sain) | Oui | ✅ Légende : Healthy (vert), Moderately Stressed (ambre), Critical Stress (rouge) | OK |
| Overlay sur carte | Oui | ⚠️ Overlay OSM avec hue-rotate/saturate (simulation), pas de tuiles NDVI réelles | Mock |

### 2.2 Couche Prédictions (Heatmap rendements)

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Heatmap rendements (tonnes/ha) par région | Oui | ⚠️ Couche "Yield Heatmap" dans selector, pas d'overlay visible sur la carte | Manquant |
| Données régionales | Oui | ✅ regionStats avec averageYield (T/ha) | OK |

### 2.3 Couche Alertes (Maladies IA)

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Zones maladies détectées Computer Vision | Oui | ⚠️ Couche "Disease Detection" dans selector, pas d'overlay sur la carte | Manquant |
| Badge/indicateur par parcelle | Implicite | ⚠️ Parcel.status = 'diseased' dans store, couleurs healthy/stressed sur polygones | Partiel |

### 2.4 Couche Météo

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Overlay précipitations temps réel (API météo) | Oui | ⚠️ TileLayer OpenWeatherMap avec `YOUR_API_KEY` - non fonctionnel | Placeholder |
| Intégration API météo | Oui | ❌ Pas de clé configurée, pas de fallback | Manquant |

---

## 3. INTERACTION AVANCÉE

### 3.1 Zoom niveau parcelle

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Zoom jusqu'à 10m résolution | Oui | ⚠️ HUD affiche "10M / PX", Leaflet zoom max ~19 (quelques mètres), pas de restriction/validation | Partiel |
| Zoom control | Implicite | ✅ Boutons +/- en overlay | OK |

### 3.2 Sélection zone géographique

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Sélection zone (draw/rect) | Oui | ❌ Pas de dessin de zone, pas de rectangle de sélection | Manquant |
| Stats agrégées zone (surface, rendement, nb agriculteurs) | Oui | ⚠️ regionStats affichées en sidebar mais pas liées à une sélection zone | Partiel |
| Surface totale / rendement moyen | Oui | ✅ regionStats : totalArea, averageYield, farmerCount | OK |

### 3.3 Comparaison temporelle

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Split slider "Avant/Après" | Oui | ❌ Bouton "Comparison Mode" présent, pas de split slider UI | Manquant |
| "2023 vs 2024" | Oui | ⚠️ Toggle 2023/2024 présent, compareMode dans store, pas de vue split | Partiel |

---

## 4. ANALYSES PRÉDICTIVES

### 4.1 Date optimale récolte

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Date optimale récolte groupée par zone (ML) | Oui | ✅ Parcel Inspector : "Harvest window optimized for October 12 - 18" | OK |
| Calcul ML | Oui | ⚠️ Affichage mock, pas d'appel API/ML réel | Mock |

### 4.2 Zones déficitaires

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Identification zones rendement < moyenne -20% | Oui | ⚠️ regionStats.riskLevel (low/high) suggère le concept, pas de calcul explicite déficit | Partiel |
| Badge/alerte zones déficitaires | Oui | ⚠️ Bouaké East "high risk", Yamoussoukro "low risk" | OK |

### 4.3 Suggestion irrigation

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Suggestion irrigation par bassin versant | Oui | ❌ Non implémenté | Manquant |

---

## 5. STACK TECHNIQUE

| Technologie | Cahier | Implémentation | Statut |
|-------------|--------|----------------|--------|
| Frontend : MapLibre GL JS | Oui | ❌ Utilise react-leaflet (Leaflet) + ArcGIS/OSM tiles | Différent |
| deck.gl pour grands volumes | Oui | ❌ Non utilisé | Manquant |
| React-Three-Fiber overlay 3D | Oui | ❌ Non utilisé | Manquant |
| Backend : Tile server personnalisé | Oui | ❌ Tiles ArcGIS/OSM externes | Manquant |
| Python FastAPI processing images | Oui | ❌ Non visible | Manquant |
| PostGIS (géométries) | Oui | ❌ Parcels mockés dans store | Manquant |
| COG (Cloud Optimized GeoTIFF) MinIO | Oui | ❌ Non utilisé | Manquant |
| TimeScaleDB séries temporelles | Oui | ❌ Non utilisé | Manquant |
| IA CNN PyTorch segmentation | Oui | ❌ Non utilisé | Manquant |

---

## 6. PERFORMANCE

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Lazy loading tuiles satellite (LOD) | Oui | ⚠️ Leaflet gère le chargement des tuiles par défaut | Partiel |
| Clustering 10k+ points | Oui | ❌ 2 parcelles mockées, pas de clustering (react-leaflet-markercluster disponible) | Manquant |
| Mode offline : Cache 24h | Oui | ❌ Non implémenté | Manquant |

---

## 7. EXPORTS

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Rapport PDF campagne par préfecture/région | Oui | ❌ Non implémenté | Manquant |
| Export GeoJSON parcelles | Oui | ⚠️ Bouton "Export Parcel Deed" présent, pas d'export GeoJSON | Placeholder |
| Partenaires gouvernementaux | Implicite | ❌ Pas de format spécifique | Manquant |

---

## 8. DONNÉES & STORE (digitalTwinStore.ts)

### 8.1 Structure

- ✅ Parcel : id, owner, cropType, area, coordinates, ndvi, predictedYield, status, healthScore, lastUpdated
- ✅ RegionStats : id, name, totalArea, averageYield, farmerCount, riskLevel
- ✅ MapLayer : satellite, ndvi, yield, diseases, weather
- ✅ TimePeriod : 2023, 2024
- ✅ Actions : toggleLayer, selectParcel, setTimePeriod, setCompareMode

### 8.2 Couches sur la carte

- ✅ Base satellite : ArcGIS World Imagery
- ⚠️ NDVI : overlay OSM avec filtre CSS (simulation)
- ⚠️ Weather : TileLayer OpenWeatherMap (API key manquante)
- ❌ Yield heatmap : pas d'overlay
- ❌ Diseases : pas d'overlay

### 8.3 Parcels mockées

- 2 parcelles (Cocoa, Coffee) avec coordonnées Côte d'Ivoire
- Polygones cliquables avec Popup
- Couleurs selon status (healthy=vert, stressed=ambre)

---

## 9. UI/UX IMPLÉMENTÉE

| Élément | Statut |
|---------|--------|
| Header Mission Control (Sentinel-2, IoT Fusion, AI) | ✅ |
| Sélecteur période 2023/2024 | ✅ |
| Bouton Comparison Mode | ✅ |
| Layer selector (NDVI, Yield, Diseases, Weather) | ✅ |
| Regional Forecast (regionStats) | ✅ |
| Carte GlobalSatelliteMap (Leaflet) | ✅ |
| Légende NDVI (Healthy, Stressed, Critical) | ✅ |
| HUD Global Coordinates + Resolution | ✅ |
| Boutons Zoom +/- | ✅ |
| Parcel Inspector (détails parcelle sélectionnée) | ✅ |
| Health metrics (Photosynthetic, Soil Moisture, Ripening) | ✅ |
| AI Prediction Node (rendement, fenêtre récolte) | ✅ |
| Bouton Export Parcel Deed | ✅ |
| Bouton Order IoT Sensing Probe | ✅ |
| État vide "Select a parcel" | ✅ |

---

## 10. ACTIONS PRIORITAIRES

### Court terme (UI/UX)

1. **Split slider comparaison** : Implémenter slider Avant/Après ou 2023 vs 2024 (vue split-screen ou slider overlay)
2. **Sélection zone** : Draw rectangle ou polygon pour sélectionner une zone et afficher stats agrégées
3. **Overlay Yield Heatmap** : Afficher une heatmap des rendements (couleurs par région/parcelle)
4. **Overlay Diseases** : Afficher zones maladies (polygones ou markers avec style distinct)
5. **Clé API météo** : Configurer `NEXT_PUBLIC_OPENWEATHERMAP_API_KEY` ou utiliser une alternative (RainViewer, etc.)

### Moyen terme (Fonctionnel)

6. **Tuiles NDVI réelles** : Intégrer un tile server NDVI (Sentinel Hub, AWS Terrakulture, ou COG MinIO)
7. **Export GeoJSON** : Générer et télécharger GeoJSON des parcelles sélectionnées
8. **Export PDF rapport** : Template PDF par préfecture/région (jsPDF + données regionStats)
9. **Zones déficitaires** : Calculer et afficher explicitement les zones < moyenne -20%
10. **Suggestion irrigation** : Afficher zones prioritaires irrigation par bassin versant (données mock puis API)

### Long terme (Stack & Backend)

11. **MapLibre GL JS** : Migration Leaflet → MapLibre pour performances et style vectoriel
12. **deck.gl** : Intégration pour visualisation 10k+ points (clustering, hexagons)
13. **Tile server personnalisé** : Backend FastAPI + COG MinIO + cache Redis
14. **PostGIS** : Stockage géométries parcelles, requêtes spatiales
15. **TimeScaleDB** : Séries temporelles capteurs IoT
16. **IA CNN** : Service Python détection anomalies/maladies sur images satellite
17. **Mode offline** : Service Worker + Cache API 24h pour tuiles

---

## 11. CONFORMITÉ GLOBALE

| Catégorie | Conformité | Notes |
|-----------|------------|-------|
| **Cartographie multi-couches** | 60% | NDVI + légende OK, Yield/Diseases/Météo partiels ou mock |
| **Interaction avancée** | 50% | Zoom OK, sélection zone et split slider manquants |
| **Analyses prédictives** | 65% | Date récolte OK, zones déficitaires partiel, irrigation absent |
| **Stack technique** | 25% | Leaflet au lieu de MapLibre, pas de deck.gl/Three, backend absent |
| **Performance** | 30% | LOD basique, pas de clustering, pas de cache offline |
| **Exports** | 15% | Boutons présents, PDF/GeoJSON non implémentés |

**Score global : 41% conforme**

---

## 12. RÉSUMÉ EXÉCUTIF

L'interface Digital Twin Global couvre les bases du cahier des charges :

**Points forts :**
- Layout Mission Control cohérent
- Couches NDVI, Yield, Diseases, Weather dans le sélecteur
- Légende NDVI (Healthy, Stressed, Critical)
- Parcel Inspector avec prédictions ML (rendement, fenêtre récolte)
- Regional Forecast avec stats (surface, rendement, risque)
- Comparaison temporelle 2023/2024 (toggle)
- Bouton Comparison Mode
- Carte Leaflet avec polygones parcelles cliquables
- Dynamic import GlobalSatelliteMap (lazy loading)

**À renforcer :**
- Overlays Yield et Diseases non affichés sur la carte
- Couche Météo avec clé API
- Split slider Avant/Après
- Sélection zone géographique et stats agrégées
- Suggestion irrigation
- Export PDF/GeoJSON
- Migration MapLibre, deck.gl, backend tile server
- Clustering, mode offline

**Prochaine étape recommandée :** Implémenter les overlays Yield et Diseases visibles sur la carte, puis le split slider de comparaison temporelle.
