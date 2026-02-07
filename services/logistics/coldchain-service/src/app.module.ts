import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ColdChainModule } from './coldchain/coldchain.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ColdChainModule,
  ],
})
export class AppModule {}
