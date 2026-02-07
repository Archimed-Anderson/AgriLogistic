import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { ForecastService } from './forecast.service';
import { AlertService } from './alert.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, ForecastService, AlertService],
  exports: [WeatherService],
})
export class WeatherModule {}
