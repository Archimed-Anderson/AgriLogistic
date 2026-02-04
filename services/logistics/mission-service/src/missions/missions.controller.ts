import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { MissionStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  create(@Body() createMissionDto: any) {
    return this.missionsService.create(createMissionDto);
  }

  @Get()
  findAll() {
    return this.missionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: MissionStatus,
    @Body('evidenceUrl') evidenceUrl?: string,
    @Body('notes') notes?: string
  ) {
    return this.missionsService.updateStatus(id, status, evidenceUrl, notes);
  }

  @Get(':id/suggestions')
  suggestDrivers(@Param('id') id: string) {
    return this.missionsService.suggestDrivers(id);
  }

  @Post(':id/evidence')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEvidence(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('status') status: MissionStatus
  ) {
    return this.missionsService.uploadPOD(id, file.buffer, file.originalname, status);
  }
}
