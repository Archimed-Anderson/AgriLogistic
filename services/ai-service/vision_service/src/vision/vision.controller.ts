import { Controller, Get, Post, Body, Param, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VisionService } from './vision.service';

@Controller('vision')
export class VisionController {
  constructor(private readonly visionService: VisionService) {}

  @Post('diagnose')
  @UseInterceptors(FileInterceptor('image'))
  diagnoseDisease(
    @UploadedFile() file: Express.Multer.File,
    @Body('cropType') cropType: string,
    @Body('farmerId') farmerId?: string,
  ) {
    return this.visionService.diagnoseDisease(file, cropType, farmerId);
  }

  @Get('diagnoses')
  findAllDiagnoses(@Query('farmerId') farmerId?: string, @Query('crop') crop?: string) {
    return this.visionService.findAllDiagnoses(farmerId, crop);
  }

  @Get('diagnoses/:id')
  findOneDiagnosis(@Param('id') id: string) {
    return this.visionService.findOneDiagnosis(id);
  }

  @Get('diseases')
  findAllDiseases(@Query('crop') crop?: string) {
    return this.visionService.findAllDiseases(crop);
  }

  @Get('diseases/:id')
  findOneDisease(@Param('id') id: string) {
    return this.visionService.findOneDisease(id);
  }

  @Get('stats/accuracy')
  getModelAccuracy() {
    return this.visionService.getModelAccuracy();
  }

  @Get('stats/epidemics')
  getEpidemicAlerts(@Query('region') region?: string) {
    return this.visionService.getEpidemicAlerts(region);
  }

  @Get('recommendations/:diagnosisId')
  getTreatmentRecommendations(@Param('diagnosisId') diagnosisId: string) {
    return this.visionService.getTreatmentRecommendations(diagnosisId);
  }
}
