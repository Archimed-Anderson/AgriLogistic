import { Module } from '@nestjs/common';
import { ColdChainController } from './coldchain.controller';
import { ColdChainService } from './coldchain.service';
import { TemperatureMonitoringService } from './temperature-monitoring.service';

@Module({
  controllers: [ColdChainController],
  providers: [ColdChainService, TemperatureMonitoringService],
  exports: [ColdChainService],
})
export class ColdChainModule {}
