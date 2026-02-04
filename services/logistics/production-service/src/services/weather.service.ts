import axios from 'axios';

const OPENWEATHER_API = process.env.OPENWEATHERMAP_API_KEY
  ? `https://api.openweathermap.org/data/2.5`
  : null;

export interface WeatherForecast {
  temp: number;
  humidity: number;
  condition: string;
  qualityImpact: 'A' | 'B' | 'C';
}

export async function getWeatherForecast(lat: number, lng: number, days = 7): Promise<WeatherForecast | null> {
  if (!OPENWEATHER_API) {
    return { temp: 28, humidity: 65, condition: 'clear', qualityImpact: 'A' };
  }
  try {
    const { data } = await axios.get(
      `${OPENWEATHER_API}/forecast?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric&cnt=${Math.min(days * 8, 40)}`
    );
    const last = data.list?.[data.list.length - 1];
    if (!last) return null;
    const avgHumidity = data.list.reduce((s: number, i: any) => s + (i.main?.humidity ?? 0), 0) / data.list.length;
    const avgTemp = data.list.reduce((s: number, i: any) => s + (i.main?.temp ?? 0), 0) / data.list.length;
    let qualityImpact: 'A' | 'B' | 'C' = 'A';
    if (avgHumidity > 85 || avgTemp > 35) qualityImpact = 'C';
    else if (avgHumidity > 75 || avgTemp > 32) qualityImpact = 'B';
    return {
      temp: avgTemp,
      humidity: avgHumidity,
      condition: last.weather?.[0]?.main ?? 'unknown',
      qualityImpact,
    };
  } catch (err) {
    console.warn('Weather API error:', err);
    return null;
  }
}
