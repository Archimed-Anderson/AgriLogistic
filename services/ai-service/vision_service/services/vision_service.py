import ollama
import os
from typing import Dict, Any

class VisionService:
    def __init__(self, model: str = "llava"):
        self.model = model

    async def diagnose_plant(self, image_path: str) -> Dict[str, Any]:
        """
        Send image to Ollama multimodal model for plant disease diagnosis.
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at {image_path}")

        prompt = (
            "Analyse cette plante, identifie la maladie et propose un traitement en 3 points. "
            "Réponds au format JSON avec les clés suivantes: 'maladie', 'gravite' (Basse, Moyenne, Critique), "
            "'traitement' (une liste de 3 points), 'analyse_visuelle'."
        )

        try:
            # Using ollama library for local inference
            response = ollama.generate(
                model=self.model,
                prompt=prompt,
                images=[image_path],
                stream=False,
                format="json" # Force JSON output if the model supports it
            )

            # Note: Not all LLaVA versions support 'format="json"' equally. 
            # We parse the response content safely.
            import json
            result = json.loads(response['response'])
            return result

        except Exception as e:
            # Fallback parsing in case JSON mode fails
            return {
                "maladie": "Inconnue",
                "gravite": "Indéterminée",
                "traitement": ["Erreur lors de l'analyse locale"],
                "analyse_visuelle": str(e),
                "error": True
            }
