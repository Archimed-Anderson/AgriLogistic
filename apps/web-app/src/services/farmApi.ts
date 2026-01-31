import { Parcel, Harvest, WeatherData } from "@/types/farmer";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const farmApi = {
  getParcels: async (): Promise<Parcel[]> => {
    await sleep(800);
    return [
      {
        id: "p1",
        name: "Parcelle Nord - Maïs",
        cropType: "Maïs",
        area: 12.5,
        healthScore: 88,
        status: "Growing",
        coordinates: [45.123, 5.456],
        plantingDate: "2024-03-15",
      },
      {
        id: "p2",
        name: "Zone Sud - Blé",
        cropType: "Blé",
        area: 8.2,
        healthScore: 72,
        status: "Growing",
        coordinates: [45.125, 5.458],
        plantingDate: "2024-04-02",
      },
      {
        id: "p3",
        name: "Vallée Est - Colza",
        cropType: "Colza",
        area: 15.0,
        healthScore: 95,
        status: "Harvested",
        coordinates: [45.128, 5.460],
        plantingDate: "2023-09-10",
      },
    ];
  },

  predictYield: async (parcelId: string): Promise<{ predictedYield: number; confidence: number }> => {
    await sleep(1200);
    return {
      predictedYield: 8.5, // tons per hectare
      confidence: 0.92,
    };
  },

  submitHarvest: async (harvest: Omit<Harvest, "id">): Promise<Harvest> => {
    await sleep(1000);
    return {
      ...harvest,
      id: `h-${Math.random().toString(36).substr(2, 9)}`,
    };
  },

  getWeather: async (): Promise<WeatherData> => {
    await sleep(500);
    return {
      temp: 24,
      humidity: 65,
      condition: "Partly Cloudy",
      forecast: [
        { day: "Mon", temp: 25 },
        { day: "Tue", temp: 22 },
        { day: "Wed", temp: 28 },
      ],
    };
  },
};
