import { Module } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { StorageService } from './storage.service';
import { RoutingService } from './routing.service';
import { GeofencingService } from './geofencing.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [MissionsController],
  providers: [MissionsService, StorageService, RoutingService, GeofencingService],
})
export class MissionsModule {}
