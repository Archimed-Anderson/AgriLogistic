import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  // Seuils par type de marchandise
  private readonly thresholds: Record<string, { min: number; max: number }> = {
    'bananes': { min: 12, max: 14 },
    'tomates': { min: 10, max: 12 },
    'lait': { min: 2, max: 8 },
  };

  checkTemperatureAlert(vehicleId: string, cargoType: string, currentTemp: number) {
    const range = this.thresholds[cargoType.toLowerCase()];
    if (!range) return null;

    if (currentTemp < range.min || currentTemp > range.max) {
      const alert = {
        vehicleId,
        type: 'TEMPERATURE_EXCURSION',
        severity: 'CRITICAL',
        message: `Temperature ${currentTemp}°C hors plage (${range.min}-${range.max}°C) pour ${cargoType}`,
        timestamp: new Date().toISOString()
      };
      this.logger.error(`ALERT: ${alert.message}`);
      
      // Trigger WhatsApp Notification
      this.sendWhatsAppNotification(vehicleId, alert.message);
      
      return alert;
    }

    return null;
  }

  private sendWhatsAppNotification(vehicleId: string, message: string) {
    this.logger.log(`WhatsApp sent to driver of ${vehicleId}: ${message}`);
    // Integration with WhatsApp Business API would go here
  }

  checkDoorSecurity(vehicleId: string, doorStatus: string, speed: number) {
      if (doorStatus === 'opened' && speed > 5) {
          return {
              vehicleId,
              type: 'SECURITY_BREACH',
              severity: 'CRITICAL',
              message: `Portes ouvertes pendant le mouvement du véhicule`,
              timestamp: new Date().toISOString()
          };
      }
      return null;
  }
}
