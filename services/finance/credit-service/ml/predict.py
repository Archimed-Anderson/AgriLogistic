"""
AgriCredit ML Prediction Service
Loads trained model and provides prediction API
"""

import pandas as pd
import numpy as np
import joblib
import json
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from train_model import CreditScoringModel, MODEL_VERSION, MODEL_PATH


class CreditPredictor:
    def __init__(self, model_version=MODEL_VERSION):
        self.model = CreditScoringModel()
        self.model_version = model_version
        self.metadata = None
        self.load_model()
    
    def load_model(self):
        """Load the trained model"""
        try:
            self.metadata = self.model.load(version=self.model_version)
            print(f"✅ Model {self.model_version} loaded successfully")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            raise
    
    def predict_credit_score(self, farmer_data):
        """
        Predict credit score for a farmer
        
        Args:
            farmer_data: dict with farmer information
                {
                    'farm_size': float,
                    'years_experience': int,
                    'avg_transaction_amount': float,
                    'transaction_count': int,
                    'on_time_payment_rate': float (0-1),
                    'crop_types': list of strings,
                    'location': string
                }
        
        Returns:
            dict with prediction results
        """
        try:
            # Convert to DataFrame
            df = pd.DataFrame([farmer_data])
            
            # Prepare features
            X = self.model.prepare_features(df)
            
            # Get prediction
            result = self.model.predict(X)
            
            # Add breakdown of score components
            result['components'] = self._calculate_score_components(farmer_data, result['score'])
            
            # Add recommendations
            result['recommendations'] = self._generate_recommendations(result)
            
            return {
                'success': True,
                'prediction': result,
                'model_version': self.model_version
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _calculate_score_components(self, farmer_data, total_score):
        """
        Break down the credit score into components
        Each component contributes to the total score
        """
        # Simplified component calculation (in production, use actual model weights)
        payment_history = int(farmer_data.get('on_time_payment_rate', 0) * 100)
        
        # Yield performance (estimated from transaction data)
        transaction_score = min(100, int(np.log1p(farmer_data.get('transaction_count', 0)) * 20))
        
        # Financial stability (based on transaction amounts)
        financial_score = min(100, int(np.log1p(farmer_data.get('avg_transaction_amount', 0)) / 10))
        
        # Market engagement (based on crop diversity and experience)
        crop_diversity = len(farmer_data.get('crop_types', []))
        experience = farmer_data.get('years_experience', 0)
        market_score = min(100, int((crop_diversity * 10) + (experience * 2)))
        
        return {
            'payment_history': payment_history,
            'yield_performance': transaction_score,
            'financial_stability': financial_score,
            'market_engagement': market_score
        }
    
    def _generate_recommendations(self, prediction):
        """Generate actionable recommendations based on credit score"""
        score = prediction['score']
        risk_level = prediction['risk_level']
        
        recommendations = []
        
        if score < 600:
            recommendations.append({
                'type': 'improve_payment_history',
                'message': 'Focus on making on-time payments to improve your credit score',
                'impact': 'high'
            })
        
        if score < 700:
            recommendations.append({
                'type': 'increase_transactions',
                'message': 'Increase your market engagement through regular transactions',
                'impact': 'medium'
            })
        
        if score >= 750:
            recommendations.append({
                'type': 'eligible_for_premium',
                'message': 'You qualify for premium loan products with lower interest rates',
                'impact': 'high'
            })
        
        # Loan amount recommendations
        if risk_level == 'low':
            max_loan = 5000000  # 5M CFA
        elif risk_level == 'medium':
            max_loan = 2000000  # 2M CFA
        elif risk_level == 'high':
            max_loan = 500000   # 500K CFA
        else:
            max_loan = 100000   # 100K CFA
        
        recommendations.append({
            'type': 'loan_eligibility',
            'message': f'Recommended maximum loan amount: {max_loan:,} CFA',
            'max_amount': max_loan,
            'impact': 'high'
        })
        
        return recommendations
    
    def batch_predict(self, farmers_data):
        """Predict credit scores for multiple farmers"""
        results = []
        for farmer_data in farmers_data:
            result = self.predict_credit_score(farmer_data)
            results.append(result)
        return results


def main():
    """CLI interface for predictions"""
    import argparse
    
    parser = argparse.ArgumentParser(description='AgriCredit ML Prediction')
    parser.add_argument('--input', type=str, help='Input JSON file with farmer data')
    parser.add_argument('--output', type=str, help='Output JSON file for predictions')
    parser.add_argument('--version', type=str, default=MODEL_VERSION, help='Model version to use')
    
    args = parser.parse_args()
    
    # Initialize predictor
    predictor = CreditPredictor(model_version=args.version)
    
    if args.input:
        # Load input data
        with open(args.input, 'r') as f:
            farmer_data = json.load(f)
        
        # Make prediction
        if isinstance(farmer_data, list):
            results = predictor.batch_predict(farmer_data)
        else:
            results = predictor.predict_credit_score(farmer_data)
        
        # Save or print results
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"✅ Predictions saved to {args.output}")
        else:
            print(json.dumps(results, indent=2))
    else:
        # Interactive mode - example prediction
        print("\n🧪 Running example prediction...")
        
        example_farmer = {
            'farm_size': 10.5,
            'years_experience': 8,
            'avg_transaction_amount': 2500,
            'transaction_count': 45,
            'on_time_payment_rate': 0.92,
            'crop_types': ['rice', 'maize', 'vegetables'],
            'location': 'Dakar'
        }
        
        result = predictor.predict_credit_score(example_farmer)
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
