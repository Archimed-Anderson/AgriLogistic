@echo off
echo ===================================================
echo 🤖 AgriCredit - ML Model Training (XGBoost)
echo ===================================================

cd ..

if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

echo 🔌 Activating virtual environment...
call venv\Scripts\activate

echo ⬇️ Installing dependencies...
pip install -r requirements.txt

echo 🧠 Training model...
python ml/train_model.py

echo ===================================================
echo ✅ Training Complete!
echo Model saved to: ml/models/
echo ===================================================
pause
