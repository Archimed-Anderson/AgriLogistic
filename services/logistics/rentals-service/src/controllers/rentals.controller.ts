import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { GeoSearchService } from '../services/geo-search.service';
import { RedisLockService } from '../services/redis-lock.service';
import { BookingService } from '../services/booking.service';

/**
 * Rentals Controller with Geographic Search and Distributed Locking
 */
@Controller('rentals')
export class RentalsController {
  constructor(
    private readonly geoSearch: GeoSearchService,
    private readonly redisLock: RedisLockService,
    private readonly bookingService: BookingService,
  ) {}

  /**
   * Find nearby equipment using PostGIS
   * 
   * GET /rentals/nearby?lat=14.7167&lon=-17.4677&radius=50&type=tractor
   * 
   * @query lat - Latitude (WGS84)
   * @query lon - Longitude (WGS84)
   * @query radius - Search radius in km (default: 50)
   * @query type - Optional equipment type filter
   */
  @Get('nearby')
  async findNearby(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('radius') radius?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    // Validate query parameters
    if (!lat || !lon) {
      throw new BadRequestException('Latitude and longitude are required');
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const radiusKm = radius ? parseFloat(radius) : 50;
    const limitResults = limit ? parseInt(limit) : 50;

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new BadRequestException('Invalid coordinates');
    }

    const results = await this.geoSearch.findNearby({
      latitude,
      longitude,
      radiusKm,
      equipmentType: type,
      limit: limitResults,
    });

    return {
      success: true,
      data: results,
      count: (results as any[]).length,
      query: {
        center: { lat: latitude, lon: longitude },
        radiusKm,
        type: type || 'all',
      },
    };
  }

  /**
   * Get equipment heatmap for visualization
   * 
   * GET /rentals/heatmap?gridSize=10
   */
  @Get('heatmap')
  async getHeatmap(@Query('gridSize') gridSize?: string) {
    const gridSizeKm = gridSize ? parseFloat(gridSize) : 10;

    const data = await this.geoSearch.getHeatmapData(gridSizeKm);

    return {
      success: true,
      data,
      gridSizeKm,
    };
  }

  /**
   * Calculate distance between two equipments
   * 
   * GET /rentals/distance/:id1/:id2
   */
  @Get('distance/:id1/:id2')
  async calculateDistance(
    @Param('id1') id1: string,
    @Param('id2') id2: string,
  ) {
    const distance = await this.geoSearch.calculateDistance(id1, id2);

    return {
      success: true,
      data: {
        equipmentId1: id1,
        equipmentId2: id2,
        distanceKm: distance,
      },
    };
  }

  /**
   * Initiate booking with Redis lock
   * 
   * POST /rentals/:equipmentId/book
   * 
   * Flow:
   * 1. Acquire Redis lock (15min TTL)
   * 2. Validate availability
   * 3. Create pending booking
   * 4. Return payment URL
   * 5. User completes payment
   * 6. Webhook confirms → finalize booking → release lock
   * 7. If timeout → auto-cancel → release lock
   */
  @Post(':equipmentId/book')
  @HttpCode(HttpStatus.OK)
  async initiateBooking(
    @Param('equipmentId') equipmentId: string,
    @Body()
    bookingData: {
      renterId: string;
      startDate: string;
      endDate: string;
    },
  ) {
    const { renterId, startDate, endDate } = bookingData;

    // Step 1: Acquire distributed lock
    try {
      await this.redisLock.acquireLock(equipmentId, renterId, 900); // 15 min
    } catch (error) {
      // Lock already exists - equipment being booked by someone else
      return {
        success: false,
        error: 'Equipment is currently being booked by another user',
        message: 'Please try again in a few minutes',
        ...error,
      };
    }

    try {
      // Step 2: Create pending booking
      const booking = await this.bookingService.createPendingBooking({
        equipmentId,
        renterId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });

      // Step 3: Generate payment link
      const paymentUrl = await this.bookingService.createPaymentSession(
        booking.id,
      );

      return {
        success: true,
        data: {
          bookingId: booking.id,
          paymentUrl,
          expiresIn: 900, // 15 minutes
          message:
            'Booking initiated. Please complete payment within 15 minutes.',
        },
      };
    } catch (error) {
      // Error creating booking - release lock
      await this.redisLock.releaseLock(equipmentId, renterId);
      throw error;
    }
  }

  /**
   * Confirm booking after payment (webhook endpoint)
   * 
   * POST /rentals/:bookingId/confirm
   */
  @Post(':bookingId/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmBooking(
    @Param('bookingId') bookingId: string,
    @Body() paymentData: { paymentId: string; renterId: string },
  ) {
    const { paymentId, renterId } = paymentData;

    try {
      // Confirm booking
      const booking = await this.bookingService.confirmBooking(
        bookingId,
        paymentId,
      );

      // Release lock
      await this.redisLock.releaseLock(booking.equipmentId, renterId);

      return {
        success: true,
        data: booking,
        message: 'Booking confirmed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel pending booking
   * 
   * POST /rentals/:bookingId/cancel
   */
  @Post(':bookingId/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelBooking(
    @Param('bookingId') bookingId: string,
    @Body() data: { renterId: string },
  ) {
    const { renterId } = data;

    try {
      const booking = await this.bookingService.cancelBooking(bookingId);

      // Release lock
      await this.redisLock.releaseLock(booking.equipmentId, renterId);

      return {
        success: true,
        data: booking,
        message: 'Booking cancelled successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if equipment is locked
   * 
   * GET /rentals/:equipmentId/lock-status
   */
  @Get(':equipmentId/lock-status')
  async checkLockStatus(@Param('equipmentId') equipmentId: string) {
    const lockInfo = await this.redisLock.checkLock(equipmentId);

    return {
      success: true,
      data: lockInfo,
    };
  }

  /**
   * Admin: View all active locks
   * 
   * GET /rentals/locks/active
   */
  @Get('locks/active')
  async getActiveLocks() {
    const locks = await this.redisLock.getActiveLocks();

    return {
      success: true,
      data: locks,
      count: locks.length,
    };
  }

  /**
   * Admin: Force release lock (emergency)
   * 
   * POST /rentals/:equipmentId/force-unlock
   */
  @Post(':equipmentId/force-unlock')
  @HttpCode(HttpStatus.OK)
  async forceUnlock(@Param('equipmentId') equipmentId: string) {
    const released = await this.redisLock.forceReleaseLock(equipmentId);

    return {
      success: released,
      message: released
        ? 'Lock forcefully released'
        : 'No lock found for this equipment',
    };
  }
}
