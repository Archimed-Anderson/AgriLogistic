import { Module } from '@nestjs/common';
import { CoopController } from './coop.controller';
import { CoopService } from './coop.service';
import { GovernanceService } from './governance.service';
import { TokenService } from './token.service';

@Module({
  controllers: [CoopController],
  providers: [CoopService, GovernanceService, TokenService],
  exports: [CoopService],
})
export class CoopModule {}
