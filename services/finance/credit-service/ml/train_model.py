"""
AgriCredit ML Model Training Script
Uses XGBoost for credit scoring based on farmer data
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
import xgboost as xgb
import joblib
import json
from datetime import datetime
import os

# Configuration
MODEL_VERSION = "v1.0.0"
MODEL_PATH = "ml/models"
DATA_PATH = "ml/data"
RANDOM_STATE = 42

class CreditScoringModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = []
        
    def prepare_features(self, df):
        """
        Prepare features for training/prediction
        
        Features:
        - Payment history (% on-time payments)
        - Average transaction amount
        - Transaction frequency
        - Farm size
        - Years of experience
        - Crop diversity
        - Seasonal consistency
        - Market engagement score
        """
        features = pd.DataFrame()
        
        # Numeric features
        features['farm_size'] = df['farm_size']
        features['years_experience'] = df['years_experience']
        features['avg_transaction_amount'] = df['avg_transaction_amount']
        features['transaction_count'] = df['transaction_count']
        features['on_time_payment_rate'] = df['on_time_payment_rate']
        features['crop_diversity'] = df['crop_types'].apply(lambda x: len(x) if isinstance(x, list) else 0)
        
        # Derived features
        features['transaction_per_year'] = df['transaction_count'] / df['years_experience'].clip(lower=1)
        features['avg_transaction_per_hectare'] = df['avg_transaction_amount'] / df['farm_size'].clip(lower=0.1)
        
        # Categorical features (encode)
        if 'location' in df.columns:
            if 'location' not in self.label_encoders:
                self.label_encoders['location'] = LabelEncoder()
                features['location_encoded'] = self.label_encoders['location'].fit_transform(df['location'].fillna('unknown'))
            else:
                features['location_encoded'] = self.label_encoders['location'].transform(df['location'].fillna('unknown'))
        
        # Fill NaN values
        features = features.fillna(0)
        
        self.feature_names = features.columns.tolist()
        return features
    
    def calculate_risk_level(self, score):
        """Convert numeric score (0-1000) to risk level"""
        if score >= 750:
            return 'low'
        elif score >= 600:
            return 'medium'
        elif score >= 400:
            return 'high'
        else:
            return 'very_high'
    
    def train(self, X, y):
        """
        Train XGBoost model
        
        Args:
            X: Feature matrix
            y: Target variable (credit score 0-1000)
        """
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=RANDOM_STATE
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Convert to risk categories for classification
        y_train_cat = pd.cut(y_train, bins=[0, 400, 600, 750, 1000], labels=['very_high', 'high', 'medium', 'low'])
        y_test_cat = pd.cut(y_test, bins=[0, 400, 600, 750, 1000], labels=['very_high', 'high', 'medium', 'low'])
        
        # Encode labels
        le = LabelEncoder()
        y_train_encoded = le.fit_transform(y_train_cat)
        y_test_encoded = le.transform(y_test_cat)
        
        # Train XGBoost model
        self.model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=RANDOM_STATE,
            eval_metric='mlogloss'
        )
        
        self.model.fit(
            X_train_scaled, 
            y_train_encoded,
            eval_set=[(X_test_scaled, y_test_encoded)],
            verbose=False
        )
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        
        metrics = {
            'accuracy': accuracy_score(y_test_encoded, y_pred),
            'precision': precision_score(y_test_encoded, y_pred, average='weighted'),
            'recall': recall_score(y_test_encoded, y_pred, average='weighted'),
            'f1_score': f1_score(y_test_encoded, y_pred, average='weighted')
        }
        
        print("\n=== Model Performance ===")
        print(f"Accuracy:  {metrics['accuracy']:.4f}")
        print(f"Precision: {metrics['precision']:.4f}")
        print(f"Recall:    {metrics['recall']:.4f}")
        print(f"F1 Score:  {metrics['f1_score']:.4f}")
        print("\n=== Classification Report ===")
        print(classification_report(y_test_encoded, y_pred, target_names=le.classes_))
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n=== Feature Importance ===")
        print(feature_importance)
        
        return metrics, feature_importance
    
    def predict(self, X):
        """
        Predict credit score and risk level
        
        Returns:
            dict with score, risk_level, confidence, and factors
        """
        X_scaled = self.scaler.transform(X)
        
        # Get prediction probabilities
        proba = self.model.predict_proba(X_scaled)[0]
        predicted_class = self.model.predict(X_scaled)[0]
        
        # Map class to score range
        class_to_score = {
            0: 300,   # very_high risk
            1: 500,   # high risk
            2: 675,   # medium risk
            3: 850    # low risk
        }
        
        score = class_to_score.get(predicted_class, 500)
        confidence = float(np.max(proba))
        risk_level = self.calculate_risk_level(score)
        
        # Get feature contributions
        feature_contributions = {}
        for i, feature in enumerate(self.feature_names):
            feature_contributions[feature] = float(X.iloc[0, i])
        
        return {
            'score': int(score),
            'risk_level': risk_level,
            'confidence': confidence,
            'factors': feature_contributions
        }
    
    def save(self, version=MODEL_VERSION):
        """Save model, scaler, and metadata"""
        os.makedirs(MODEL_PATH, exist_ok=True)
        
        # Save model
        model_file = f"{MODEL_PATH}/credit_model_{version}.pkl"
        joblib.dump(self.model, model_file)
        
        # Save scaler
        scaler_file = f"{MODEL_PATH}/scaler_{version}.pkl"
        joblib.dump(self.scaler, scaler_file)
        
        # Save label encoders
        encoders_file = f"{MODEL_PATH}/encoders_{version}.pkl"
        joblib.dump(self.label_encoders, encoders_file)
        
        # Save metadata
        metadata = {
            'version': version,
            'trained_at': datetime.now().isoformat(),
            'feature_names': self.feature_names,
            'model_type': 'XGBoost Classifier'
        }
        
        metadata_file = f"{MODEL_PATH}/metadata_{version}.json"
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\n✅ Model saved: {model_file}")
        print(f"✅ Scaler saved: {scaler_file}")
        print(f"✅ Metadata saved: {metadata_file}")
    
    def load(self, version=MODEL_VERSION):
        """Load model, scaler, and metadata"""
        model_file = f"{MODEL_PATH}/credit_model_{version}.pkl"
        scaler_file = f"{MODEL_PATH}/scaler_{version}.pkl"
        encoders_file = f"{MODEL_PATH}/encoders_{version}.pkl"
        
        self.model = joblib.load(model_file)
        self.scaler = joblib.load(scaler_file)
        self.label_encoders = joblib.load(encoders_file)
        
        metadata_file = f"{MODEL_PATH}/metadata_{version}.json"
        with open(metadata_file, 'r') as f:
            metadata = json.load(f)
        
        self.feature_names = metadata['feature_names']
        print(f"✅ Model loaded: {version}")
        return metadata


def generate_synthetic_data(n_samples=1000):
    """Generate synthetic training data for demonstration"""
    np.random.seed(RANDOM_STATE)
    
    data = {
        'farmer_id': [f'farmer_{i}' for i in range(n_samples)],
        'farm_size': np.random.uniform(0.5, 50, n_samples),
        'years_experience': np.random.randint(1, 30, n_samples),
        'avg_transaction_amount': np.random.uniform(100, 10000, n_samples),
        'transaction_count': np.random.randint(5, 200, n_samples),
        'on_time_payment_rate': np.random.uniform(0.5, 1.0, n_samples),
        'crop_types': [np.random.choice(['rice', 'maize', 'cassava', 'vegetables'], size=np.random.randint(1, 4)).tolist() for _ in range(n_samples)],
        'location': np.random.choice(['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor'], n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Generate target (credit score) based on features
    score = (
        df['on_time_payment_rate'] * 400 +
        np.log1p(df['transaction_count']) * 50 +
        np.log1p(df['farm_size']) * 30 +
        df['years_experience'] * 10 +
        np.random.normal(0, 50, n_samples)  # Add noise
    )
    
    # Clip to 0-1000 range
    df['credit_score'] = score.clip(0, 1000).astype(int)
    
    return df


if __name__ == "__main__":
    print("🚀 AgriCredit ML Model Training")
    print("=" * 50)
    
    # Generate or load data
    print("\n📊 Generating synthetic training data...")
    df = generate_synthetic_data(n_samples=5000)
    print(f"✅ Generated {len(df)} samples")
    
    # Initialize model
    model = CreditScoringModel()
    
    # Prepare features
    print("\n🔧 Preparing features...")
    X = model.prepare_features(df)
    y = df['credit_score']
    print(f"✅ Features prepared: {X.shape}")
    
    # Train model
    print("\n🎯 Training model...")
    metrics, feature_importance = model.train(X, y)
    
    # Save model
    print("\n💾 Saving model...")
    model.save(version=MODEL_VERSION)
    
    # Test prediction
    print("\n🧪 Testing prediction...")
    test_sample = X.iloc[[0]]
    prediction = model.predict(test_sample)
    print(f"\nSample Prediction:")
    print(f"  Score: {prediction['score']}")
    print(f"  Risk Level: {prediction['risk_level']}")
    print(f"  Confidence: {prediction['confidence']:.2%}")
    
    print("\n✅ Training complete!")
