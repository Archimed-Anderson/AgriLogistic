/**
 * Rental Types
 */

export interface Equipment {
  id: string;
  name: string;
  type: 'tractor' | 'harvester' | 'planter' | 'sprayer' | 'trailer' | 'other';
  brand: string;
  model: string;
  year: number;
  serialNumber: string;
  status: 'available' | 'rented' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  images: string[];
  specifications: {
    power?: string;
    capacity?: string;
    weight?: string;
    dimensions?: string;
  };
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  location: {
    coordinates: [number, number];
    address: string;
    lastUpdated: Date;
  };
  usage: {
    totalHours: number;
    lastService: Date;
    nextService: Date;
    serviceInterval: number; // hours
  };
  currentRental?: {
    rentalId: string;
    renterId: string;
    renterName: string;
    startDate: Date;
    endDate: Date;
    totalCost: number;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    coverage: number;
    expiryDate: Date;
  };
}

export interface Rental {
  id: string;
  rentalNumber: string;
  equipmentId: string;
  equipmentName: string;
  renter: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  startDate: Date;
  endDate: Date;
  actualReturnDate?: Date;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  pricing: {
    rateType: 'hourly' | 'daily' | 'weekly' | 'monthly';
    rate: number;
    duration: number;
    subtotal: number;
    insurance: number;
    tax: number;
    total: number;
  };
  contract: {
    signed: boolean;
    signedDate?: Date;
    documentUrl?: string;
  };
  delivery: {
    required: boolean;
    address?: string;
    cost?: number;
  };
  tracking?: {
    currentLocation: [number, number];
    lastUpdate: Date;
    hoursUsed: number;
    fuelLevel?: number;
  };
  incidents: RentalIncident[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RentalIncident {
  id: string;
  type: 'damage' | 'breakdown' | 'accident' | 'other';
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  reportedDate: Date;
  images?: string[];
  cost?: number;
  resolved: boolean;
  resolvedDate?: Date;
}

export interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
  technician?: string;
  notes?: string;
  nextDue?: Date;
}

export interface AvailabilitySlot {
  equipmentId: string;
  date: Date;
  available: boolean;
  reason?: string; // 'rented', 'maintenance', 'reserved'
  rentalId?: string;
}
