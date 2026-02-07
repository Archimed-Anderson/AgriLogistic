import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VisionModule } from './vision/vision.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VisionModule,
  ],
})
export class AppModule {}
