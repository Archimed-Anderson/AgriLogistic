import requests
import json
import os

# Configuration
API_URL = "http://localhost:3009/vision/analyze"
IMAGE_PATH = "test_leaf.jpg" # Remplacer par une image réelle pour le test
LAT = 14.7167  # Exemple: Dakar
LON = -17.4677

def test_vision_api():
    if not os.path.exists(IMAGE_PATH):
        print(f"Erreur: Veuillez placer une image de test à {IMAGE_PATH}")
        return

    print(f"🚀 Envoi de l'image {IMAGE_PATH} pour diagnostic...")
    
    with open(IMAGE_PATH, 'rb') as img_file:
        files = {'image': img_file}
        data = {
            'latitude': LAT,
            'longitude': LON
        }
        
        try:
            response = requests.post(API_URL, files=files, data=data)
            response.raise_for_status()
            
            result = response.json()
            print("\n✅ Analyse Complétée avec Succès :\n")
            print(json.dumps(result, indent=4, ensure-ascii=False))
            
        except Exception as e:
            print(f"❌ Échec du test : {e}")

if __name__ == "__main__":
    # Note: Assurez-vous qu'Ollama tourne avec le modèle llava
    # Commande : ollama run llava
    test_vision_api()
