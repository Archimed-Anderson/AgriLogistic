import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly bucketName = 'agrodeep-missions';

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000')),
      useSSL: this.configService.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  async onModuleInit() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      console.log(`🗄️ Bucket '${this.bucketName}' created.`);
    }
  }

  async uploadFile(fileName: string, buffer: Buffer, metadata: any = {}): Promise<string> {
    await this.minioClient.putObject(this.bucketName, fileName, buffer, metadata);
    
    // Return the URL (in production this would be a public/presigned URL)
    const endpoint = this.configService.get('MINIO_EXTERNAL_URL', 'http://localhost:9000');
    return `${endpoint}/${this.bucketName}/${fileName}`;
  }

  async getPresignedUrl(fileName: string): Promise<string> {
    return this.minioClient.presignedGetObject(this.bucketName, fileName, 24 * 60 * 60);
  }
}
