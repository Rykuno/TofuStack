import { inject, injectable } from '@needle-di/core';
import { ConfigService } from '../common/configs/config.service';
import { generateId } from '../common/utils/crypto';
import { Client } from 'minio';
import sharp, { type ResizeOptions } from 'sharp';
import { bucketPolicy } from './storage.configs';

type Upload = {
  file: File;
  key?: string;
  resizeOptions?: ResizeOptions;
};

@injectable()
export class StorageService {
  private readonly minioClient: Client;
  private readonly bucket = 'dev';

  constructor(private configService = inject(ConfigService)) {
    this.minioClient = new Client({
      endPoint: this.configService.envs.STORAGE_HOST,
      port: this.configService.envs.STORAGE_PORT,
      useSSL: false,
      accessKey: this.configService.envs.STORAGE_ACCESS_KEY,
      secretKey: this.configService.envs.STORAGE_SECRET_KEY
    });
  }

  async configure() {
    console.info('configuring storage...');
    const bucketExists = await this.minioClient.bucketExists(this.bucket);

    if (!bucketExists) {
      console.info('creating storage bucket...');
      await this.minioClient.makeBucket(this.bucket);
      await this.minioClient.setBucketPolicy(this.bucket, JSON.stringify(bucketPolicy));
    }
  }

  async upload({ file, resizeOptions, key }: Upload) {
    let buffer = await this.convertToBuffer(file);
    if (resizeOptions) {
      buffer = await this.resizeImage(buffer, resizeOptions);
    }

    const fileKey = key || generateId();
    await this.minioClient.putObject(this.bucket, fileKey, buffer, file.size, {
      'Content-Type': file.type
    });
    return { key: fileKey };
  }

  async remove(key: string) {
    return this.minioClient.removeObject(this.bucket, key);
  }

  private async resizeImage(fileBuffer: Buffer, resizeOptions: ResizeOptions) {
    return sharp(fileBuffer).resize(resizeOptions).toBuffer();
  }

  private async convertToBuffer(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
