import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CashflowService } from './cashflow/cashflow.service';
import { AnomalyService } from './anomalies/anomaly.service';
import { ReportingService } from './reporting/reporting.service';
import { FinanceController } from './finance.controller';
import { FinanceGateway } from './finance.gateway';
import { MonetizationController } from './monetization/monetization.controller';
import { MonetizationService } from './monetization/monetization.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [FinanceController, MonetizationController],
  providers: [CashflowService, AnomalyService, ReportingService, FinanceGateway, MonetizationService],
})
export class AppModule {}
