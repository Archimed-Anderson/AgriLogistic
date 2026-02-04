import { Controller, Get, Post, Body } from '@nestjs/common';
import { CashflowService } from './cashflow/cashflow.service';
import { AnomalyService } from './anomalies/anomaly.service';
import { ReportingService } from './reporting/reporting.service';

@Controller('finance')
export class FinanceController {
  constructor(
    private readonly cashflowService: CashflowService,
    private readonly anomalyService: AnomalyService,
    private readonly reportingService: ReportingService,
  ) {}

  @Get('reports/pl/excel')
  async getExcelReport() {
    return this.reportingService.generateDailyPL();
  }

  @Get('reports/pl/pdf')
  async getPDFReport() {
    return this.reportingService.generatePDFReport();
  }

  @Get('summary')
  getSummary() {
    return {
      cashflow: this.cashflowService.getGlobalCashflow(),
      regional: this.cashflowService.getRegionalLiquidity(),
      forecast: this.cashflowService.get30DayForecast(),
    };
  }

  @Get('anomalies')
  getRecentAnomalies() {
    return [
      { id: 'A1', type: 'HIGH_VOLUME', message: 'Volume de retrait inhabituel sur Wallet SN-04', severity: 'critical', time: '10:15' },
    ];
  }

  @Post('check-transaction')
  checkTransaction(@Body() transaction: { amount: number; userId: string; walletId?: string }) {
    return this.anomalyService.detectAnomalies(transaction);
  }
}
