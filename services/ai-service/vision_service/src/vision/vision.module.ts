import { Module } from '@nestjs/common';
import { VisionController } from './vision.controller';
import { VisionService } from './vision.service';
import { DiagnosisService } from './diagnosis.service';

@Module({
  controllers: [VisionController],
  providers: [VisionService, DiagnosisService],
  exports: [VisionService],
})
export class VisionModule {}
