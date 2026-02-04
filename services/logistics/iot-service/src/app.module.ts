import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelemetryController } from './telemetry/telemetry.controller';
import { TelemetryService } from './telemetry/telemetry.service';
import { AlertService } from './alerts/alert.service';
import { MaintenanceService } from './maintenance/maintenance.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService, AlertService, MaintenanceService],
})
export class AppModule {}
