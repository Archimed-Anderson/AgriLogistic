import { Controller, Get, Param } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { MaintenanceService } from '../maintenance/maintenance.service';
import { AlertService } from '../alerts/alert.service';

@Controller('iot')
export class TelemetryController {
  constructor(
    private readonly telemetryService: TelemetryService,
    private readonly maintenanceService: MaintenanceService,
    private readonly alertService: AlertService,
  ) {}

  @Get('fleet/:id/live')
  async getLiveMetrics(@Param('id') id: string) {
    const metrics = await this.telemetryService.getLatestMetrics(id);
    const maintenance = this.maintenanceService.getMaintenanceSchedule(id);
    return {
      ...metrics,
      maintenance,
    };
  }

  @Get('fleet/status')
  async getFleetStatus() {
      // Mocked for demo
      return [
          { id: 'TRK-001', status: 'online', temp: 13.5, signal: 'strong' },
          { id: 'TRK-002', status: 'online', temp: 11.2, signal: 'medium' },
          { id: 'TRK-003', status: 'alert', temp: 18.2, signal: 'weak' },
      ];
  }
}
