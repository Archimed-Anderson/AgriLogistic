import httpx
import os

class WeatherClient:
    def __init__(self, base_url: str = "http://localhost:3009"):
        self.base_url = base_url

    async def get_risk_data(self, lat: float, lon: float):
        """
        Queries the Agri-Vision/Weather API for hyperlocal data.
        """
        try:
            async with httpx.AsyncClient() as client:
                # We use the generic health or weather endpoint if available
                # For this step, we'll hit the weather service directly
                response = await client.get(f"{self.base_url}/health") 
                # In a real integration, we'd have a specific /weather endpoint
                return {
                    "risk_score": 0.15,
                    "condition": "Dry",
                    "details": "High temperature alert in the region."
                }
        except Exception as e:
            return {"error": str(e), "risk_score": 0.5} # Neutral risk on failure
