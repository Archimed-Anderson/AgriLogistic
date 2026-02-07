import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RentalsService } from './rentals.service';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  create(@Body() createRentalDto: any) {
    return this.rentalsService.create(createRentalDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.rentalsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentalDto: any) {
    return this.rentalsService.update(id, updateRentalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(id);
  }

  @Get('equipment/available')
  findAvailableEquipment() {
    return this.rentalsService.findAvailableEquipment();
  }

  @Post(':id/book')
  bookEquipment(@Param('id') id: string, @Body() bookingDto: any) {
    return this.rentalsService.bookEquipment(id, bookingDto);
  }
}
