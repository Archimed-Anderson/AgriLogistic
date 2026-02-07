#!/bin/bash

echo "==================================================="
echo "🤖 AgriCredit - ML Model Training (XGBoost)"
echo "==================================================="

# Go to service root
cd "$(dirname "$0")/.."

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "⬇️ Installing dependencies..."
pip install -r requirements.txt

# Run training
echo "🧠 Training model..."
python3 ml/train_model.py

echo "==================================================="
echo "✅ Training Complete!"
echo "Model saved to: ml/models/"
echo "==================================================="
