import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  getCurrentWeather(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
  ) {
    return this.weatherService.getCurrentWeather(lat, lng);
  }

  @Get('forecast')
  getForecast(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('days') days: number = 14,
  ) {
    return this.weatherService.getForecast(lat, lng, days);
  }

  @Get('hyperlocal')
  getHyperlocalForecast(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
  ) {
    return this.weatherService.getHyperlocalForecast(lat, lng);
  }

  @Get('alerts')
  getAlerts(@Query('region') region?: string) {
    return this.weatherService.getAlerts(region);
  }

  @Post('alerts/subscribe')
  subscribeToAlerts(@Body() subscriptionDto: any) {
    return this.weatherService.subscribeToAlerts(subscriptionDto);
  }

  @Get('agronomic/:farmId')
  getAgronomicRecommendations(@Param('farmId') farmId: string) {
    return this.weatherService.getAgronomicRecommendations(farmId);
  }

  @Get('evapotranspiration')
  getEvapotranspiration(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
  ) {
    return this.weatherService.getEvapotranspiration(lat, lng);
  }

  @Get('growing-degree-days')
  getGrowingDegreeDays(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('crop') crop: string,
  ) {
    return this.weatherService.getGrowingDegreeDays(lat, lng, crop);
  }
}
