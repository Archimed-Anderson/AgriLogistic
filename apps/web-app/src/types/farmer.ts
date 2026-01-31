export interface Parcel {
  id: string;
  name: string;
  cropType: string;
  area: number; // in hectares
  healthScore: number; // 0-100
  status: 'Growing' | 'Harvested' | 'Fallow';
  coordinates: [number, number];
  plantingDate: string;
}

export interface Harvest {
  id: string;
  parcelId: string;
  cropType: string;
  quantity: number; // in tons
  date: string;
  quality: 'A' | 'B' | 'C';
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface FarmerNotification {
  id: string;
  type: 'alert' | 'info' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  forecast: Array<{
    day: string;
    temp: number;
  }>;
}
