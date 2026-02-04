import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MissionsModule } from './missions/missions.module';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MissionsModule,
  ],
})
export class AppModule {}
