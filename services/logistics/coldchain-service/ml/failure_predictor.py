import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

class FailurePredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model_path = "services/logistics/coldchain-service/ml/failure_model.pkl"

    def generate_synthetic_data(self, samples=1000):
        """
        Génère des données d'entraînement :
        - temp: température moyenne
        - vibration: niveau de vibration du compresseur
        - pressure: pression du gaz réfrigérant
        - runtime: heures de fonctionnement hebdomadaire
        """
        np.random.seed(42)
        temp = np.random.normal(4, 2, samples)
        vibration = np.random.normal(0.5, 0.2, samples)
        pressure = np.random.normal(150, 20, samples)
        runtime = np.random.uniform(10, 100, samples)
        
        # Label: Panne (1) si pression trop basse et vibration élevée
        failure = ((pressure < 110) & (vibration > 0.7) | (temp > 10)).astype(int)
        
        return pd.DataFrame({
            'avg_temp': temp,
            'vibration': vibration,
            'gas_pressure': pressure,
            'weekly_runtime': runtime,
            'target': failure
        })

    def train(self):
        print("📊 Préparation des données d'entraînement...")
        df = self.generate_synthetic_data()
        X = df.drop('target', axis=1)
        y = df['target']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        
        print("🧠 Entraînement du modèle Random Forest...")
        self.model.fit(X_train, y_train)
        
        y_pred = self.model.predict(X_test)
        print("\n🏆 Rapport de Performance :")
        print(classification_report(y_test, y_pred))
        
        # Sauvegarde
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        print(f"✅ Modèle sauvegardé dans {self.model_path}")

    def predict(self, current_data):
        if not os.path.exists(self.model_path):
            self.train()
        
        # Prédiction pour un vecteur de données [temp, vib, press, runtime]
        prediction = self.model.predict_proba([current_data])[0]
        return {
            "failure_probability": round(prediction[1] * 100, 2),
            "status": "Warning" if prediction[1] > 0.5 else "Safe",
            "critical": prediction[1] > 0.8
        }

if __name__ == "__main__":
    predictor = FailurePredictor()
    predictor.train()
    
    # Test unitaire
    test_sample = [8.5, 0.8, 105.0, 85.0] # Exemple critique
    print(f"\n🔮 Test de prédiction pour {test_sample} :")
    print(predictor.predict(test_sample))
