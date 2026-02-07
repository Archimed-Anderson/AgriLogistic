import { Module } from '@nestjs/common';
import { RentalsController } from './controllers/rentals.controller';
import { GeoSearchService } from './services/geo-search.service';
import { RedisLockService } from './services/redis-lock.service';
import { BookingService } from './services/booking.service';

@Module({
  imports: [],
  controllers: [RentalsController],
  providers: [GeoSearchService, RedisLockService, BookingService],
})
export class AppModule {}
