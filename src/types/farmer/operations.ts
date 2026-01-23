/**
 * Farm Operations Types
 */

export interface FarmField {
  id: string;
  name: string;
  area: number; // hectares
  coordinates: [number, number][]; // polygon
  soilType: string;
  currentCrop?: {
    id: string;
    name: string;
    plantedDate: Date;
    expectedHarvest: Date;
    status: 'planted' | 'growing' | 'ready' | 'harvested';
  };
  lastPlanted?: Date;
  nextPlanned?: {
    cropId: string;
    cropName: string;
    plannedDate: Date;
  };
  irrigationSystem?: 'drip' | 'sprinkler' | 'flood' | 'none';
  sensors: IoTSensor[];
}

export interface IoTSensor {
  id: string;
  type: 'soil_moisture' | 'temperature' | 'humidity' | 'ph' | 'nutrients' | 'light';
  location: {
    fieldId: string;
    coordinates: [number, number];
  };
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  lastReading: {
    value: number;
    unit: string;
    timestamp: Date;
    status: 'normal' | 'warning' | 'critical';
  };
  batteryLevel?: number;
  threshold?: {
    min: number;
    max: number;
  };
}

export interface CropRotationPlan {
  id: string;
  fieldId: string;
  fieldName: string;
  currentCrop: string;
  rotationSequence: {
    season: string;
    crop: string;
    benefits: string[];
    estimatedYield: number;
  }[];
  aiScore: number; // 0-100
  soilHealthImpact: 'positive' | 'neutral' | 'negative';
  recommendations: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'seeds' | 'fertilizer' | 'pesticide' | 'equipment' | 'other';
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  cost: number;
  supplier: string;
  lastRestocked: Date;
  expiryDate?: Date;
  location: string;
}

export interface BudgetEntry {
  id: string;
  date: Date;
  category: 'seeds' | 'fertilizer' | 'labor' | 'equipment' | 'utilities' | 'other';
  description: string;
  type: 'expense' | 'income';
  amount: number;
  status: 'planned' | 'actual' | 'overdue';
  fieldId?: string;
  cropId?: string;
}

export interface CropProfitability {
  cropId: string;
  cropName: string;
  area: number;
  totalRevenue: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
  roi: number;
  yieldPerHectare: number;
  costBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}
