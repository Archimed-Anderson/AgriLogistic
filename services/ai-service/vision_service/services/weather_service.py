import httpx
from typing import Dict, Any

class WeatherService:
    @staticmethod
    async def get_hyperlocal_weather(lat: float, lon: float) -> Dict[str, Any]:
        """
        Fetch weather data from Open-Meteo API.
        """
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": ["temperature_2m", "relative_humidity_2m", "precipitation"],
            "timezone": "auto"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current", {})
            return {
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "precipitation": current.get("precipitation"),
                "units": {
                    "temperature": "°C",
                    "humidity": "%",
                    "precipitation": "mm"
                }
            }
