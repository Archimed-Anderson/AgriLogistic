# 🚀 AgroLogistic Platform - Phase 2 Implementation Plan

## Overview
Phase 2 focuses on advanced infrastructure (Service Mesh), AI/ML capabilities, real-time analytics, and mobile applications.

**Timeline:** Q2 2026 (12 weeks)  
**Priority:** 🟡 HIGH  
**Prerequisites:** Phase 1 must be complete

---

## 📋 Phase 2 Objectives

### Success Criteria
- ✅ Istio Service Mesh operational with mTLS
- ✅ AI/ML service with deployed models
- ✅ ClickHouse analytics with real-time dashboards
- ✅ Mobile apps (iOS + Android) in beta
- ✅ Advanced delivery service with real GPS tracking
- ✅ All Phase 1 features remain functional

---

## 🕸️ Service 1: Istio Service Mesh

### **Weeks 1-3: Service Mesh Implementation**

#### 1.1 Istio Installation

**Infrastructure Setup:**
```yaml
# /infrastructure/istio/istio-config.yaml

apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: AgroLogistic-istio
spec:
  profile: production
  
  meshConfig:
    # Enable mTLS by default
    enableAutoMtls: true
    
    # Access logging
    accessLogFile: /dev/stdout
    accessLogEncoding: JSON
    
    # Tracing configuration
    defaultConfig:
      tracing:
        zipkin:
          address: zipkin.istio-system:9411
        sampling: 10.0
    
    # Service discovery
    discoverySelectors:
      - matchLabels:
          istio-injection: enabled

  components:
    pilot:
      k8s:
        resources:
          requests:
            cpu: 500m
            memory: 2Gi
          limits:
            cpu: 1000m
            memory: 4Gi
    
    ingressGateways:
      - name: istio-ingressgateway
        enabled: true
        k8s:
          service:
            type: LoadBalancer
            ports:
              - port: 80
                targetPort: 8080
                name: http2
              - port: 443
                targetPort: 8443
                name: https
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 2000m
              memory: 1024Mi

    egressGateways:
      - name: istio-egressgateway
        enabled: true
```

#### 1.2 mTLS Configuration

**Peer Authentication:**
```yaml
# /infrastructure/istio/peer-authentication.yaml

apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: AgroLogistic
spec:
  mtls:
    mode: STRICT  # Require mTLS for all services

---

apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: auth-service-mtls
  namespace: AgroLogistic
spec:
  selector:
    matchLabels:
      app: auth-service
  mtls:
    mode: STRICT
  portLevelMtls:
    3001:
      mode: STRICT
```

**Authorization Policies:**
```yaml
# /infrastructure/istio/authorization-policy.yaml

apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: product-service-authz
  namespace: AgroLogistic
spec:
  selector:
    matchLabels:
      app: product-service
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/AgroLogistic/sa/api-gateway"]
      to:
        - operation:
            methods: ["GET", "POST", "PUT", "DELETE"]
            paths: ["/api/v1/products/*"]
      when:
        - key: request.auth.claims[role]
          values: ["admin", "user"]
```

#### 1.3 Circuit Breaker Configuration

```yaml
# /infrastructure/istio/destination-rule.yaml

apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: product-service
  namespace: AgroLogistic
spec:
  host: product-service.AgroLogistic.svc.cluster.local
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 2
    
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 40
    
    loadBalancer:
      simple: LEAST_REQUEST
    
    tls:
      mode: ISTIO_MUTUAL  # Use Istio mTLS

---

apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: order-service
  namespace: AgroLogistic
spec:
  host: order-service.AgroLogistic.svc.cluster.local
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 200
      http:
        http1MaxPendingRequests: 100
        http2MaxRequests: 200
    
    outlierDetection:
      consecutive5xxErrors: 3
      interval: 10s
      baseEjectionTime: 1m
      maxEjectionPercent: 50
```

#### 1.4 Retry and Timeout Policies

```yaml
# /infrastructure/istio/virtual-service.yaml

apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: product-service
  namespace: AgroLogistic
spec:
  hosts:
    - product-service.AgroLogistic.svc.cluster.local
  http:
    - match:
        - uri:
            prefix: /api/v1/products
      route:
        - destination:
            host: product-service.AgroLogistic.svc.cluster.local
            port:
              number: 3002
      retries:
        attempts: 3
        perTryTimeout: 2s
        retryOn: 5xx,reset,connect-failure,refused-stream
      timeout: 10s
      fault:
        delay:
          percentage:
            value: 0.1
          fixedDelay: 5s
```

#### 1.5 Service Mesh Monitoring

```yaml
# /infrastructure/istio/monitoring.yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus
  namespace: istio-system
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    scrape_configs:
      - job_name: 'istio-mesh'
        kubernetes_sd_configs:
          - role: endpoints
            namespaces:
              names:
                - istio-system
                - AgroLogistic
        
        relabel_configs:
          - source_labels: [__meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
            action: keep
            regex: istio-telemetry;prometheus
```

---

## 🤖 Service 2: AI/ML Service

### **Weeks 4-6: Machine Learning Pipeline**

#### 2.1 ML Service Structure

```
/services/ai-service/
├── models/
│   ├── recommendation/
│   │   ├── collaborative_filtering.py
│   │   ├── content_based.py
│   │   └── hybrid_model.py
│   ├── forecasting/
│   │   ├── prophet_model.py
│   │   ├── lstm_model.py
│   │   └── arima_model.py
│   ├── disease_detection/
│   │   ├── cnn_model.py
│   │   └── resnet_model.py
│   └── price_prediction/
│       ├── xgboost_model.py
│       └── ensemble_model.py
├── training/
│   ├── train_recommendation.py
│   ├── train_forecasting.py
│   └── train_disease.py
├── serving/
│   ├── model_server.py
│   ├── inference.py
│   └── batch_prediction.py
├── preprocessing/
│   ├── feature_engineering.py
│   └── data_cleaning.py
├── monitoring/
│   ├── model_metrics.py
│   └── drift_detection.py
└── api/
    ├── recommendation_api.py
    ├── forecasting_api.py
    └── prediction_api.py
```

#### 2.2 Recommendation Engine

**Collaborative Filtering:**
```python
# /services/ai-service/models/recommendation/collaborative_filtering.py

import numpy as np
import pandas as pd
from scipy.sparse.linalg import svds
from sklearn.metrics.pairwise import cosine_similarity

class CollaborativeFiltering:
    def __init__(self, n_factors=50):
        self.n_factors = n_factors
        self.user_factors = None
        self.item_factors = None
        self.user_bias = None
        self.item_bias = None
        self.global_mean = None
    
    def fit(self, ratings_matrix):
        """
        Train collaborative filtering model using SVD
        ratings_matrix: User-Item matrix (users x items)
        """
        # Fill missing values with global mean
        self.global_mean = np.nanmean(ratings_matrix)
        ratings_filled = np.nan_to_num(ratings_matrix, nan=self.global_mean)
        
        # Calculate biases
        self.user_bias = np.mean(ratings_filled, axis=1) - self.global_mean
        self.item_bias = np.mean(ratings_filled, axis=0) - self.global_mean
        
        # Center the matrix
        ratings_centered = ratings_filled - self.global_mean
        ratings_centered -= self.user_bias[:, np.newaxis]
        ratings_centered -= self.item_bias
        
        # Perform SVD
        U, sigma, Vt = svds(ratings_centered, k=self.n_factors)
        
        self.user_factors = U
        self.item_factors = Vt.T
        self.sigma = np.diag(sigma)
        
        return self
    
    def predict(self, user_id, item_ids=None):
        """
        Predict ratings for user-item pairs
        """
        if item_ids is None:
            # Predict for all items
            predictions = (
                self.global_mean +
                self.user_bias[user_id] +
                self.item_bias +
                (self.user_factors[user_id] @ self.sigma @ self.item_factors.T)
            )
        else:
            predictions = (
                self.global_mean +
                self.user_bias[user_id] +
                self.item_bias[item_ids] +
                (self.user_factors[user_id] @ self.sigma @ self.item_factors[item_ids].T)
            )
        
        return predictions
    
    def recommend(self, user_id, n_recommendations=10, exclude_items=None):
        """
        Get top N recommendations for a user
        """
        predictions = self.predict(user_id)
        
        if exclude_items is not None:
            predictions[exclude_items] = -np.inf
        
        top_items = np.argsort(predictions)[-n_recommendations:][::-1]
        top_scores = predictions[top_items]
        
        return list(zip(top_items, top_scores))


class HybridRecommendation:
    """
    Hybrid recommendation combining collaborative and content-based filtering
    """
    def __init__(self, cf_weight=0.7, cb_weight=0.3):
        self.cf_weight = cf_weight
        self.cb_weight = cb_weight
        self.cf_model = CollaborativeFiltering()
        self.item_features = None
    
    def fit(self, ratings_matrix, item_features):
        """
        Train hybrid model
        """
        self.cf_model.fit(ratings_matrix)
        self.item_features = item_features
        
        # Calculate item similarity based on features
        self.item_similarity = cosine_similarity(item_features)
        
        return self
    
    def recommend(self, user_id, user_history, n_recommendations=10):
        """
        Generate hybrid recommendations
        """
        # Get collaborative filtering recommendations
        cf_recs = self.cf_model.recommend(user_id, n_recommendations * 2)
        cf_items = [item for item, _ in cf_recs]
        cf_scores = dict(cf_recs)
        
        # Get content-based recommendations
        cb_scores = {}
        for item in cf_items:
            # Find similar items based on content
            similar_items = np.argsort(self.item_similarity[item])[-20:]
            
            # Score based on similarity to user's history
            score = 0
            for hist_item in user_history:
                if hist_item in similar_items:
                    score += self.item_similarity[item, hist_item]
            
            cb_scores[item] = score / len(user_history) if user_history else 0
        
        # Combine scores
        hybrid_scores = {}
        for item in cf_items:
            hybrid_scores[item] = (
                self.cf_weight * cf_scores[item] +
                self.cb_weight * cb_scores.get(item, 0)
            )
        
        # Sort and return top N
        sorted_items = sorted(
            hybrid_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:n_recommendations]
        
        return sorted_items
```

#### 2.3 Time Series Forecasting

**Prophet Model:**
```python
# /services/ai-service/models/forecasting/prophet_model.py

from prophet import Prophet
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class ProphetForecaster:
    def __init__(self, growth='linear', seasonality_mode='multiplicative'):
        self.model = Prophet(
            growth=growth,
            seasonality_mode=seasonality_mode,
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05
        )
        
        # Add custom seasonalities
        self.model.add_seasonality(
            name='monthly',
            period=30.5,
            fourier_order=5
        )
    
    def fit(self, df):
        """
        Train Prophet model
        df: DataFrame with 'ds' (date) and 'y' (value) columns
        """
        self.model.fit(df)
        return self
    
    def predict(self, periods=30, freq='D'):
        """
        Generate forecast
        """
        future = self.model.make_future_dataframe(periods=periods, freq=freq)
        forecast = self.model.predict(future)
        
        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    
    def get_confidence_intervals(self, forecast, confidence=0.95):
        """
        Calculate confidence intervals
        """
        alpha = 1 - confidence
        z_score = 1.96  # 95% confidence
        
        forecast['confidence'] = (
            (forecast['yhat_upper'] - forecast['yhat_lower']) /
            (2 * z_score * forecast['yhat'])
        ) * 100
        
        return forecast
    
    def detect_anomalies(self, df):
        """
        Detect anomalies in time series
        """
        forecast = self.model.predict(df)
        
        anomalies = df[
            (df['y'] < forecast['yhat_lower']) |
            (df['y'] > forecast['yhat_upper'])
        ]
        
        return anomalies


class YieldPredictor:
    """
    Predict crop yield based on historical data and external factors
    """
    def __init__(self):
        self.model = ProphetForecaster()
        self.weather_impact = {}
        self.soil_impact = {}
    
    def add_weather_regressor(self):
        """
        Add weather factors as regressors
        """
        self.model.model.add_regressor('temperature')
        self.model.model.add_regressor('rainfall')
        self.model.model.add_regressor('humidity')
    
    def add_soil_regressor(self):
        """
        Add soil factors as regressors
        """
        self.model.model.add_regressor('soil_moisture')
        self.model.model.add_regressor('soil_ph')
        self.model.model.add_regressor('nitrogen_level')
    
    def fit(self, historical_data):
        """
        Train yield prediction model
        historical_data: DataFrame with yield and environmental factors
        """
        self.add_weather_regressor()
        self.add_soil_regressor()
        
        self.model.fit(historical_data)
        return self
    
    def predict_yield(self, future_conditions):
        """
        Predict crop yield based on conditions
        """
        forecast = self.model.predict(periods=len(future_conditions))
        
        # Add confidence scores
        forecast = self.model.get_confidence_intervals(forecast)
        
        return {
            'predicted_yield': forecast['yhat'].values,
            'lower_bound': forecast['yhat_lower'].values,
            'upper_bound': forecast['yhat_upper'].values,
            'confidence': forecast['confidence'].values
        }
```

#### 2.4 Disease Detection Model

**CNN Model:**
```python
# /services/ai-service/models/disease_detection/cnn_model.py

import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
from PIL import Image

class DiseaseDetectionCNN:
    def __init__(self, num_classes=10, input_shape=(224, 224, 3)):
        self.num_classes = num_classes
        self.input_shape = input_shape
        self.model = self._build_model()
    
    def _build_model(self):
        """
        Build CNN architecture for disease detection
        """
        model = models.Sequential([
            # Block 1
            layers.Conv2D(32, (3, 3), activation='relu', input_shape=self.input_shape),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.2),
            
            # Block 2
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.2),
            
            # Block 3
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.3),
            
            # Block 4
            layers.Conv2D(256, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.3),
            
            # Dense layers
            layers.Flatten(),
            layers.Dense(512, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(self.num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=3)]
        )
        
        return model
    
    def train(self, train_data, val_data, epochs=50, batch_size=32):
        """
        Train the model
        """
        callbacks = [
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7
            ),
            tf.keras.callbacks.ModelCheckpoint(
                'best_model.h5',
                monitor='val_accuracy',
                save_best_only=True
            )
        ]
        
        history = self.model.fit(
            train_data,
            validation_data=val_data,
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks
        )
        
        return history
    
    def predict(self, image_path):
        """
        Predict disease from image
        """
        # Load and preprocess image
        img = Image.open(image_path)
        img = img.resize((self.input_shape[0], self.input_shape[1]))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Predict
        predictions = self.model.predict(img_array)
        predicted_class = np.argmax(predictions[0])
        confidence = predictions[0][predicted_class]
        
        # Get top 3 predictions
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        top_3_predictions = [
            {
                'class_id': int(idx),
                'confidence': float(predictions[0][idx])
            }
            for idx in top_3_indices
        ]
        
        return {
            'predicted_class': int(predicted_class),
            'confidence': float(confidence),
            'top_3_predictions': top_3_predictions
        }
    
    def save_model(self, path):
        """
        Save trained model
        """
        self.model.save(path)
    
    def load_model(self, path):
        """
        Load trained model
        """
        self.model = tf.keras.models.load_model(path)
```

#### 2.5 ML Model Serving

**FastAPI Server:**
```python
# /services/ai-service/serving/model_server.py

from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import numpy as np
import pickle
from typing import List, Optional
import tensorflow as tf

app = FastAPI(title="AgroLogistic AI Service", version="1.0.0")

# Load models
recommendation_model = pickle.load(open('models/recommendation_model.pkl', 'rb'))
disease_model = tf.keras.models.load_model('models/disease_detection_model.h5')
yield_model = pickle.load(open('models/yield_prediction_model.pkl', 'rb'))

class RecommendationRequest(BaseModel):
    user_id: str
    n_recommendations: int = 10
    exclude_items: Optional[List[str]] = None

class ForecastRequest(BaseModel):
    historical_data: List[float]
    periods: int = 30
    confidence_level: float = 0.95

class YieldPredictionRequest(BaseModel):
    crop_type: str
    area_hectares: float
    temperature: float
    rainfall: float
    humidity: float
    soil_moisture: float
    soil_ph: float
    nitrogen_level: float

@app.post("/api/v1/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """
    Get product recommendations for user
    """
    try:
        recommendations = recommendation_model.recommend(
            user_id=request.user_id,
            n_recommendations=request.n_recommendations,
            exclude_items=request.exclude_items
        )
        
        return {
            "user_id": request.user_id,
            "recommendations": [
                {
                    "product_id": str(item_id),
                    "score": float(score),
                    "confidence": min(float(score) * 100, 100)
                }
                for item_id, score in recommendations
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/disease-detection")
async def detect_disease(file: UploadFile = File(...)):
    """
    Detect crop disease from image
    """
    try:
        # Save uploaded file
        contents = await file.read()
        with open(f"/tmp/{file.filename}", "wb") as f:
            f.write(contents)
        
        # Predict
        result = disease_model.predict(f"/tmp/{file.filename}")
        
        disease_names = {
            0: "Healthy",
            1: "Powdery Mildew",
            2: "Rust",
            3: "Leaf Blight",
            4: "Bacterial Spot",
            # ... more diseases
        }
        
        return {
            "predicted_disease": disease_names.get(result['predicted_class'], "Unknown"),
            "confidence": result['confidence'],
            "top_predictions": [
                {
                    "disease": disease_names.get(pred['class_id'], "Unknown"),
                    "confidence": pred['confidence']
                }
                for pred in result['top_3_predictions']
            ],
            "recommendation": get_treatment_recommendation(result['predicted_class'])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/yield-prediction")
async def predict_yield(request: YieldPredictionRequest):
    """
    Predict crop yield
    """
    try:
        future_conditions = {
            'temperature': [request.temperature],
            'rainfall': [request.rainfall],
            'humidity': [request.humidity],
            'soil_moisture': [request.soil_moisture],
            'soil_ph': [request.soil_ph],
            'nitrogen_level': [request.nitrogen_level]
        }
        
        prediction = yield_model.predict_yield(future_conditions)
        
        return {
            "crop_type": request.crop_type,
            "area_hectares": request.area_hectares,
            "predicted_yield_tons": float(prediction['predicted_yield'][0] * request.area_hectares),
            "lower_bound_tons": float(prediction['lower_bound'][0] * request.area_hectares),
            "upper_bound_tons": float(prediction['upper_bound'][0] * request.area_hectares),
            "confidence_percentage": float(prediction['confidence'][0]),
            "recommendation": generate_yield_recommendation(prediction)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_treatment_recommendation(disease_class):
    """
    Get treatment recommendations based on disease
    """
    treatments = {
        1: {
            "disease": "Powdery Mildew",
            "treatment": "Apply sulfur-based fungicide",
            "prevention": "Improve air circulation, reduce humidity"
        },
        2: {
            "disease": "Rust",
            "treatment": "Use copper-based fungicide",
            "prevention": "Remove infected leaves, ensure proper drainage"
        },
        # ... more treatments
    }
    
    return treatments.get(disease_class, {
        "disease": "Unknown",
        "treatment": "Consult agricultural expert",
        "prevention": "Monitor crop health regularly"
    })

def generate_yield_recommendation(prediction):
    """
    Generate recommendations to improve yield
    """
    confidence = prediction['confidence'][0]
    
    if confidence > 85:
        return "Conditions are optimal. Maintain current practices."
    elif confidence > 70:
        return "Good conditions. Consider minor adjustments to irrigation."
    else:
        return "Suboptimal conditions. Review soil quality and water management."

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3005)
```

---

## 📊 Service 3: Analytics Service (ClickHouse)

### **Weeks 7-8: Real-Time Analytics**

#### 3.1 ClickHouse Schema

```sql
-- /services/analytics-service/schemas/events.sql

CREATE DATABASE IF NOT EXISTS AgroLogistic_analytics;

-- User activity events
CREATE TABLE IF NOT EXISTS AgroLogistic_analytics.user_events (
    event_id UUID DEFAULT generateUUIDv4(),
    user_id UUID NOT NULL,
    event_type LowCardinality(String) NOT NULL,
    event_timestamp DateTime64(3) NOT NULL,
    session_id UUID NOT NULL,
    
    -- Event properties
    properties String,  -- JSON string
    
    -- Page/screen info
    page_url String,
    page_title String,
    referrer String,
    
    -- Device info
    device_type LowCardinality(String),
    browser LowCardinality(String),
    os LowCardinality(String),
    
    -- Location
    country LowCardinality(String),
    city String,
    ip_address IPv4,
    
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_timestamp)
ORDER BY (event_type, user_id, event_timestamp)
TTL event_timestamp + INTERVAL 2 YEAR;

-- Product analytics
CREATE TABLE IF NOT EXISTS AgroLogistic_analytics.product_events (
    event_id UUID DEFAULT generateUUIDv4(),
    product_id UUID NOT NULL,
    event_type LowCardinality(String) NOT NULL,
    user_id UUID,
    
    -- Event data
    event_timestamp DateTime64(3) NOT NULL,
    quantity UInt32 DEFAULT 0,
    price Decimal(10, 2) DEFAULT 0,
    
    -- Metadata
    category_id UUID,
    seller_id UUID,
    
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_timestamp)
ORDER BY (product_id, event_type, event_timestamp);

-- Order analytics
CREATE TABLE IF NOT EXISTS AgroLogistic_analytics.order_events (
    order_id UUID NOT NULL,
    user_id UUID NOT NULL,
    status LowCardinality(String) NOT NULL,
    
    total_amount Decimal(10, 2) NOT NULL,
    items_count UInt32 NOT NULL,
    
    created_at DateTime NOT NULL,
    updated_at DateTime NOT NULL
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (order_id, user_id);

-- Materialized views for aggregations
CREATE MATERIALIZED VIEW IF NOT EXISTS AgroLogistic_analytics.daily_product_stats
ENGINE = SummingMergeTree()
ORDER BY (date, product_id)
AS
SELECT
    toDate(event_timestamp) as date,
    product_id,
    event_type,
    count() as event_count,
    sum(quantity) as total_quantity,
    sum(price * quantity) as total_revenue
FROM AgroLogistic_analytics.product_events
WHERE event_type IN ('view', 'add_to_cart', 'purchase')
GROUP BY date, product_id, event_type;
```

#### 3.2 Real-Time Dashboard API

```typescript
// /services/analytics-service/src/api/dashboard-api.ts

import { ClickHouse } from 'clickhouse';

const clickhouse = new ClickHouse({
  url: process.env.CLICKHOUSE_URL,
  port: 8123,
  debug: false,
  basicAuth: {
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
  },
  isUseGzip: true,
});

export class DashboardAPI {
  /**
   * Get real-time KPIs
   */
  async getRealtimeKPIs(timeRange: string = '24h') {
    const interval = this.parseTimeRange(timeRange);
    
    const query = `
      SELECT
        countDistinct(user_id) as active_users,
        count() as total_events,
        countIf(event_type = 'purchase') as total_purchases,
        sumIf(price * quantity, event_type = 'purchase') as total_revenue,
        avg(price) as avg_order_value
      FROM AgroLogistic_analytics.product_events
      WHERE event_timestamp >= now() - INTERVAL ${interval}
    `;
    
    const result = await clickhouse.query(query).toPromise();
    return result[0];
  }

  /**
   * Get product performance
   */
  async getProductPerformance(productId: string, days: number = 30) {
    const query = `
      SELECT
        toDate(event_timestamp) as date,
        event_type,
        count() as count,
        sum(quantity) as total_quantity,
        sum(price * quantity) as revenue
      FROM AgroLogistic_analytics.product_events
      WHERE product_id = '${productId}'
        AND event_timestamp >= today() - INTERVAL ${days} DAY
      GROUP BY date, event_type
      ORDER BY date DESC
    `;
    
    const result = await clickhouse.query(query).toPromise();
    return result;
  }

  /**
   * Get trending products
   */
  async getTrendingProducts(limit: number = 10) {
    const query = `
      SELECT
        product_id,
        count() as view_count,
        countIf(event_type = 'add_to_cart') as cart_adds,
        countIf(event_type = 'purchase') as purchases,
        purchases / view_count * 100 as conversion_rate
      FROM AgroLogistic_analytics.product_events
      WHERE event_timestamp >= now() - INTERVAL 7 DAY
      GROUP BY product_id
      HAVING view_count > 100
      ORDER BY view_count DESC
      LIMIT ${limit}
    `;
    
    const result = await clickhouse.query(query).toPromise();
    return result;
  }

  /**
   * Get user cohort analysis
   */
  async getCohortAnalysis() {
    const query = `
      WITH first_purchase AS (
        SELECT
          user_id,
          toStartOfMonth(min(event_timestamp)) as cohort_month
        FROM AgroLogistic_analytics.order_events
        WHERE status = 'completed'
        GROUP BY user_id
      ),
      user_activities AS (
        SELECT
          fp.cohort_month,
          oe.user_id,
          toStartOfMonth(oe.created_at) as activity_month,
          dateDiff('month', fp.cohort_month, toStartOfMonth(oe.created_at)) as months_since_first
        FROM AgroLogistic_analytics.order_events oe
        INNER JOIN first_purchase fp ON oe.user_id = fp.user_id
        WHERE oe.status = 'completed'
      )
      SELECT
        cohort_month,
        months_since_first,
        count(DISTINCT user_id) as active_users,
        count(DISTINCT user_id) / (
          SELECT count(DISTINCT user_id)
          FROM user_activities ua2
          WHERE ua2.cohort_month = ua1.cohort_month
            AND ua2.months_since_first = 0
        ) * 100 as retention_rate
      FROM user_activities ua1
      GROUP BY cohort_month, months_since_first
      ORDER BY cohort_month DESC, months_since_first ASC
    `;
    
    const result = await clickhouse.query(query).toPromise();
    return result;
  }

  private parseTimeRange(timeRange: string): string {
    const match = timeRange.match(/(\d+)([hdwmy])/);
    if (!match) return '1 DAY';
    
    const [, value, unit] = match;
    const units = {
      h: 'HOUR',
      d: 'DAY',
      w: 'WEEK',
      m: 'MONTH',
      y: 'YEAR'
    };
    
    return `${value} ${units[unit]}`;
  }
}
```

---

## 📱 Service 4: Mobile Applications

### **Weeks 9-12: Flutter Mobile Apps**

#### 4.1 Project Structure

```
/mobile/
├── buyer-app/
│   ├── lib/
│   │   ├── main.dart
│   │   ├── app.dart
│   │   ├── core/
│   │   │   ├── api/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── marketplace/
│   │   │   ├── orders/
│   │   │   └── profile/
│   │   └── shared/
│   │       ├── widgets/
│   │       └── themes/
│   ├── pubspec.yaml
│   └── android/ios/
│
└── driver-app/
    ├── lib/
    │   ├── main.dart
    │   ├── features/
    │   │   ├── auth/
    │   │   ├── missions/
    │   │   ├── tracking/
    │   │   └── earnings/
    │   └── core/
    ├── pubspec.yaml
    └── android/ios/
```

#### 4.2 API Integration

```dart
// /mobile/buyer-app/lib/core/api/api_client.dart

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class APIClient {
  final Dio _dio;
  final FlutterSecureStorage _storage;
  
  static const String baseUrl = 'http://api.AgroLogistic.com/v1';
  
  APIClient() 
    : _dio = Dio(BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: Duration(seconds: 30),
        receiveTimeout: Duration(seconds: 30),
      )),
      _storage = FlutterSecureStorage() {
    _initializeInterceptors();
  }
  
  void _initializeInterceptors() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Add auth token
        final token = await _storage.read(key: 'access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      
      onError: (error, handler) async {
        // Handle token refresh on 401
        if (error.response?.statusCode == 401) {
          final refreshToken = await _storage.read(key: 'refresh_token');
          
          if (refreshToken != null) {
            try {
              final response = await _dio.post('/auth/refresh', data: {
                'refreshToken': refreshToken,
              });
              
              final newToken = response.data['accessToken'];
              await _storage.write(key: 'access_token', value: newToken);
              
              // Retry original request
              final opts = error.requestOptions;
              opts.headers['Authorization'] = 'Bearer $newToken';
              return handler.resolve(await _dio.fetch(opts));
            } catch (e) {
              // Refresh failed, logout user
              await _storage.deleteAll();
              return handler.reject(error);
            }
          }
        }
        
        return handler.next(error);
      },
    ));
  }
  
  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) {
    return _dio.get(path, queryParameters: queryParameters);
  }
  
  Future<Response> post(String path, {dynamic data}) {
    return _dio.post(path, data: data);
  }
  
  Future<Response> put(String path, {dynamic data}) {
    return _dio.put(path, data: data);
  }
  
  Future<Response> delete(String path) {
    return _dio.delete(path);
  }
}
```

#### 4.3 Offline Sync

```dart
// /mobile/buyer-app/lib/core/services/sync_service.dart

import 'package:sqflite/sqflite.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class SyncService {
  final Database _database;
  final APIClient _apiClient;
  bool _isSyncing = false;
  
  SyncService(this._database, this._apiClient) {
    _listenToConnectivity();
  }
  
  void _listenToConnectivity() {
    Connectivity().onConnectivityChanged.listen((result) {
      if (result != ConnectivityResult.none && !_isSyncing) {
        syncPendingChanges();
      }
    });
  }
  
  Future<void> syncPendingChanges() async {
    if (_isSyncing) return;
    
    _isSyncing = true;
    
    try {
      // Get pending operations
      final pendingOps = await _database.query(
        'pending_operations',
        orderBy: 'created_at ASC',
      );
      
      for (final op in pendingOps) {
        try {
          await _executeSyncOperation(op);
          
          // Remove from pending
          await _database.delete(
            'pending_operations',
            where: 'id = ?',
            whereArgs: [op['id']],
          );
        } catch (e) {
          print('Failed to sync operation ${op['id']}: $e');
          // Will retry on next sync
        }
      }
    } finally {
      _isSyncing = false;
    }
  }
  
  Future<void> _executeSyncOperation(Map<String, dynamic> op) async {
    final type = op['type'];
    final data = json.decode(op['data']);
    
    switch (type) {
      case 'create_order':
        await _apiClient.post('/orders', data: data);
        break;
      case 'update_profile':
        await _apiClient.put('/profile', data: data);
        break;
      // ... more operations
    }
  }
  
  Future<void> queueOperation(String type, Map<String, dynamic> data) async {
    await _database.insert('pending_operations', {
      'type': type,
      'data': json.encode(data),
      'created_at': DateTime.now().toIso8601String(),
    });
    
    // Try to sync immediately if online
    final connectivity = await Connectivity().checkConnectivity();
    if (connectivity != ConnectivityResult.none) {
      syncPendingChanges();
    }
  }
}
```

---

## ✅ Phase 2 Success Criteria

**Technical:**
- Istio mTLS working with >99.9% success rate
- AI models serving predictions with <500ms latency
- ClickHouse queries returning in <1s
- Mobile apps with offline capabilities
- GPS tracking with <5s update frequency

**Business:**
- AI recommendations improve conversion by >10%
- Disease detection accuracy >85%
- Mobile app crashes <0.1%
- User satisfaction >4.5/5

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Status:** 🟢 Ready for Implementation
