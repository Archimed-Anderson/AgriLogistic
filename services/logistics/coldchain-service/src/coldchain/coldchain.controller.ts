import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ColdChainService } from './coldchain.service';

@Controller('coldchain')
export class ColdChainController {
  constructor(private readonly coldChainService: ColdChainService) {}

  @Post('storage')
  createStorageUnit(@Body() storageDto: any) {
    return this.coldChainService.createStorageUnit(storageDto);
  }

  @Get('storage')
  findAllStorageUnits(@Query('type') type?: string) {
    return this.coldChainService.findAllStorageUnits(type);
  }

  @Get('storage/:id')
  findOneStorageUnit(@Param('id') id: string) {
    return this.coldChainService.findOneStorageUnit(id);
  }

  @Get('storage/:id/temperature')
  getTemperatureHistory(@Param('id') id: string, @Query('hours') hours?: number) {
    return this.coldChainService.getTemperatureHistory(id, hours);
  }

  @Post('trucks')
  createColdTruck(@Body() truckDto: any) {
    return this.coldChainService.createColdTruck(truckDto);
  }

  @Get('trucks')
  findAllColdTrucks(@Query('status') status?: string) {
    return this.coldChainService.findAllColdTrucks(status);
  }

  @Get('trucks/:id/tracking')
  trackColdTruck(@Param('id') id: string) {
    return this.coldChainService.trackColdTruck(id);
  }

  @Post('alerts')
  createTemperatureAlert(@Body() alertDto: any) {
    return this.coldChainService.createTemperatureAlert(alertDto);
  }

  @Get('alerts')
  findAllAlerts(@Query('severity') severity?: string) {
    return this.coldChainService.findAllAlerts(severity);
  }

  @Get('stats/breach-rate')
  getBreachRate() {
    return this.coldChainService.getBreachRate();
  }
}
