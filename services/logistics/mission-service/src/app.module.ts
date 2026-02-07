import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MissionsModule } from './missions/missions.module';
import { DatabaseModule } from './database/database.module';
import { WarRoomGateway } from './gateways/war-room.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MissionsModule,
  ],
  providers: [WarRoomGateway],
})
export class AppModule {}
