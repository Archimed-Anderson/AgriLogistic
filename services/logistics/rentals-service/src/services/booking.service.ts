import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Booking Service
 * 
 * Handles equipment booking lifecycle
 */
@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Create a pending booking (before payment)
   */
  async createPendingBooking(data: {
    equipmentId: string;
    renterId: string;
    startDate: Date;
    endDate: Date;
  }) {
    const { equipmentId, renterId, startDate, endDate } = data;

    // Calculate total price
    const equipment: any = await this.prisma.$queryRaw`
      SELECT "pricePerDay" FROM "Equipment" WHERE id = ${equipmentId}::uuid
    `;

    if (!equipment || equipment.length === 0) {
      throw new NotFoundException('Equipment not found');
    }

    const pricePerDay = parseFloat(equipment[0].pricePerDay);
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = pricePerDay * days;

    // Create booking
    const booking: any = await this.prisma.$queryRaw`
      INSERT INTO "Booking" 
        ("equipmentId", "renterId", "startDate", "endDate", "totalPrice", status)
      VALUES 
        (${equipmentId}::uuid, ${renterId}::uuid, ${startDate}, ${endDate}, ${totalPrice}, 'pending')
      RETURNING *
    `;

    this.logger.log(`Pending booking created: ${booking[0].id}`);

    return booking[0];
  }

  /**
   * Confirm booking after successful payment
   */
  async confirmBooking(bookingId: string, paymentId: string) {
    const booking: any = await this.prisma.$queryRaw`
      UPDATE "Booking"
      SET 
        status = 'confirmed',
        "paidAt" = NOW(),
        "paymentId" = ${paymentId},
        "updatedAt" = NOW()
      WHERE id = ${bookingId}::uuid
      RETURNING *
    `;

    if (!booking || booking.length === 0) {
      throw new NotFoundException('Booking not found');
    }

    // Mark equipment as unavailable
    await this.prisma.$queryRaw`
      UPDATE "Equipment"
      SET available = false, "updatedAt" = NOW()
      WHERE id = ${booking[0].equipmentId}::uuid
    `;

    this.logger.log(`Booking confirmed: ${bookingId}`);

    return booking[0];
  }

  /**
   * Cancel a pending booking
   */
  async cancelBooking(bookingId: string) {
    const booking: any = await this.prisma.$queryRaw`
      UPDATE "Booking"
      SET status = 'cancelled', "updatedAt" = NOW()
      WHERE id = ${bookingId}::uuid AND status = 'pending'
      RETURNING *
    `;

    if (!booking || booking.length === 0) {
      throw new NotFoundException('Booking not found or already processed');
    }

    this.logger.log(`Booking cancelled: ${bookingId}`);

    return booking[0];
  }

  /**
   * Create payment session (placeholder - integrate with actual payment provider)
   */
  async createPaymentSession(bookingId: string): Promise<string> {
    // TODO: Integrate with Stripe, Wave, Orange Money, etc.
    // For now, return a mock URL
    return `https://payment.agrilogistic.com/checkout/${bookingId}`;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
