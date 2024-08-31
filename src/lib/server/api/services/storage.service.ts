import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createId } from '@paralleldrive/cuid2';
import { inject, injectable } from 'tsyringe';
import { env } from '../configs/envs.config';
import { S3ClientProvider } from '../providers/s3.provider';

@injectable()
export class StorageService {
  constructor(@inject(S3ClientProvider) private readonly s3Client: S3ClientProvider) { }

  async upload(file: File) {
    const key = createId();
    const uploadCommand = new PutObjectCommand({
      Bucket: env.STORAGE_BUCKET_NAME,
      ACL: 'public-read',
      Key: key,
      ContentType: file.type,
      Body: new Uint8Array(await file.arrayBuffer())
    });

    const response = await this.s3Client.send(uploadCommand);
    return { ...response, size: file.size, name: file.name, type: file.type, key };
  }

  delete(key: string) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: env.STORAGE_BUCKET_NAME,
      Key: key
    });

    return this.s3Client.send(deleteCommand);
  }
}
