import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoopModule } from './coop/coop.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CoopModule,
  ],
})
export class AppModule {}
