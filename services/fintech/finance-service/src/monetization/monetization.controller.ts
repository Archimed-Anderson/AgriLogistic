import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { MonetizationService } from './monetization.service';

@Controller('monetization')
export class MonetizationController {
  constructor(private readonly monetizationService: MonetizationService) {}

  @Get('dashboard')
  getDashboard() {
    return this.monetizationService.getRevenueDashboard();
  }

  @Get('subscriptions')
  getSubscriptions() {
    return this.monetizationService.getSubscriptions();
  }

  @Get('analytics')
  getAnalytics() {
    return this.monetizationService.getAnalytics();
  }

  @Post('invoice/:userId')
  async generateInvoice(
    @Param('userId') userId: string,
    @Query('month') month: string,
  ) {
    return this.monetizationService.generateInvoice(userId, month || new Date().toISOString());
  }

  @Get('split')
  calculateSplit(
    @Query('amount') amount: string,
    @Query('distance') distance: string,
  ) {
    return this.monetizationService.calculateSplit(Number(amount), Number(distance));
  }
}
