/**
 * Mock Availability Data
 * Realistic booking schedules for equipment
 */

import type { TimeSlot, BookingConstraints } from "../reservation/AvailabilityCalendar";

// Generate availability for next 6 months
export const generateMockAvailability = (equipmentId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  // Generate 180 days of availability
  for (let i = 0; i < 180; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Determine status based on patterns
    let status: TimeSlot["status"] = "available";
    let bookedBy: string | undefined;
    let reservationId: string | undefined;
    let notes: string | undefined;
    
    // Peak season: March-May, September-November
    const month = date.getMonth();
    const isPeakSeason = (month >= 2 && month <= 4) || (month >= 8 && month <= 10);
    
    if (isPeakSeason) {
      status = "peak-season";
    }
    
    // Random reservations (40% occupancy)
    if (Math.random() < 0.4 && i > 7) {
      status = "reserved";
      reservationId = `RES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      bookedBy = ["Jean Dupont", "Marie Martin", "Pierre Dubois", "Sophie Bernard"][Math.floor(Math.random() * 4)];
      notes = "Confirmed reservation";
    }
    
    // Maintenance windows (5% of time)
    if (Math.random() < 0.05 && i > 30) {
      status = "maintenance";
      notes = "Scheduled maintenance";
    }
    
    // Blocked dates (rare, 2%)
    if (Math.random() < 0.02 && i > 60) {
      status = "blocked";
      notes = "Owner blocked";
    }
    
    // Pricing based on equipment and season
    let price = 450; // Base price for tractors
    if (equipmentId.includes("MOIS")) price = 850;
    if (equipmentId.includes("EPA")) price = 180;
    if (equipmentId.includes("PUL")) price = 280;
    if (equipmentId.includes("SEM")) price = 320;
    if (equipmentId.includes("DEC")) price = 150;
    
    // Apply peak season pricing
    if (status === "peak-season") {
      price = Math.round(price * 1.25);
    }
    
    slots.push({
      date,
      status,
      price,
      reservationId,
      bookedBy,
      notes,
    });
  }
  
  return slots;
};

// Standard booking constraints for agricultural equipment
export const standardConstraints: BookingConstraints = {
  minDays: 3,
  maxDays: 90,
  advanceNoticeDays: 2,
  blackoutDates: [
    // Add holidays and special dates
    new Date(2026, 0, 1), // New Year
    new Date(2026, 4, 1), // Labor Day
    new Date(2026, 11, 25), // Christmas
  ],
  maintenanceWindows: [
    {
      start: new Date(2026, 3, 15), // April 15
      end: new Date(2026, 3, 18), // April 18
    },
    {
      start: new Date(2026, 9, 10), // October 10
      end: new Date(2026, 9, 12), // October 12
    },
  ],
};

// Constraints for high-value equipment (shorter rentals allowed)
export const premiumConstraints: BookingConstraints = {
  minDays: 1,
  maxDays: 60,
  advanceNoticeDays: 1,
  blackoutDates: standardConstraints.blackoutDates,
  maintenanceWindows: standardConstraints.maintenanceWindows,
};

// Constraints for heavy machinery (longer minimum)
export const heavyMachineryConstraints: BookingConstraints = {
  minDays: 7,
  maxDays: 120,
  advanceNoticeDays: 5,
  blackoutDates: standardConstraints.blackoutDates,
  maintenanceWindows: standardConstraints.maintenanceWindows,
};

// Get constraints based on equipment type
export const getConstraintsByCategory = (category: string): BookingConstraints => {
  if (category === "Moissonneuse") return heavyMachineryConstraints;
  if (category === "Tracteur") return standardConstraints;
  return premiumConstraints;
};
