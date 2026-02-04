# Exports de dashboards Superset (Cahier Monitoring Métier)

Ce dossier contient les exports JSON des dashboards prédéfinis pour chaque rôle.

## Dashboards à créer (cahier des charges)

### Executive - Vue Générale
- **GMV Temps Réel** : Big Number + Trend (source: orders, filtre date_range)
- **Carte Transactions** : Deck.GL Scatter (orders + parcels, filtres product_type, date)
- **Funnel Conversion** : Funnel (events, cohort_date)
- **Top Produits** : Bar Chart (products, region, date)
- **Satisfaction NPS** : Gauge (feedbacks)

### Opérations Logistiques
- **Carte Flotte Temps Réel** : Deck.GL Path (missions + iot, status, transporter)
- **Performance Transport** : Mixed Chart (missions, date_range)
- **Taux Remplissage** : Pie Chart (vehicles, type)
- **Alertes Temps Réel** : Table Log (incidents, severity)

### Agriculteur - Performance
- **Revenus Mensuels** : Line Chart (payments, farmer_id, date)
- **Rendement vs Prévision** : Bar Chart (parcels + predictions, crop_type, season)
- **Qualité Produits** : Box Plot (quality_scores, product_category)

## Import

Après création des dashboards dans l’UI Superset, les exporter en JSON (Dashboard > … > Export) et placer les fichiers ici. Puis :

```bash
superset import-dashboards -p /app/pythonpath/dashboards/exports/*.json
```

Ou importer manuellement via l’UI : Settings > Import dashboards.

## Datasources requis

- **agrilogistic_prod** : PostgreSQL (données métier : orders, products, parcels, payments, etc.)
- **analytics_warehouse** : ClickHouse (analytics : events, missions, incidents, feedbacks)

Ces datasources se configurent dans Superset : Data > Connect Database.
