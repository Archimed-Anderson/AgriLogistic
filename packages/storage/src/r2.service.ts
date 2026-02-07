import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface UploadUrlOptions {
  bucket: string;
  key: string;
  contentType: string;
  expiresIn?: number; // seconds, default 900 (15 minutes)
}

export interface DownloadUrlOptions {
  bucket: string;
  key: string;
  expiresIn?: number; // seconds, default 3600 (1 hour)
}

/**
 * Cloudflare R2 Storage Service
 * 
 * S3-compatible object storage with zero egress fees.
 * Perfect for serving product images, user uploads, and documents.
 * 
 * @example
 * ```typescript
 * const r2 = new R2StorageService({
 *   accountId: process.env.R2_ACCOUNT_ID!,
 *   accessKeyId: process.env.R2_ACCESS_KEY_ID!,
 *   secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
 * });
 * 
 * // Generate upload URL for client-side upload
 * const uploadUrl = await r2.generateUploadUrl({
 *   bucket: 'agri-products',
 *   key: 'products/tomato-123.jpg',
 *   contentType: 'image/jpeg',
 * });
 * ```
 */
export class R2StorageService {
  private client: S3Client;

  constructor(config: R2Config) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * Generate a presigned URL for uploading a file
   * 
   * The client can use this URL to upload directly to R2,
   * bypassing the backend and saving bandwidth.
   */
  async generateUploadUrl(options: UploadUrlOptions): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: options.bucket,
      Key: options.key,
      ContentType: options.contentType,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: options.expiresIn || 900, // 15 minutes default
    });
  }

  /**
   * Generate a presigned URL for downloading a file
   * 
   * Useful for private files (KYC documents, contracts)
   * that should only be accessible with a temporary URL.
   */
  async generateDownloadUrl(options: DownloadUrlOptions): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: options.bucket,
      Key: options.key,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: options.expiresIn || 3600, // 1 hour default
    });
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  /**
   * Get public URL for a file in a public bucket
   * 
   * Only use for public buckets like 'agri-products'
   */
  getPublicUrl(accountId: string, bucket: string, key: string): string {
    return `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${key}`;
  }
}

// Export singleton instance
let r2Instance: R2StorageService | null = null;

export function getR2Client(): R2StorageService {
  if (!r2Instance) {
    r2Instance = new R2StorageService({
      accountId: process.env.R2_ACCOUNT_ID!,
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    });
  }
  return r2Instance;
}
