import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createId } from '@paralleldrive/cuid2';
import { injectable } from 'tsyringe';
import { config } from '../common/config';

@injectable()
export class StorageService {
  protected readonly s3Client: S3Client

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: config.storage.url,
      credentials: {
        accessKeyId: config.storage.accessKey,
        secretAccessKey: config.storage.secretKey
      },
      forcePathStyle: true
    })
  }

  async upload(file: File) {
    const key = createId();
    const uploadCommand = new PutObjectCommand({
      Bucket: config.storage.bucket,
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
      Bucket: config.storage.bucket,
      Key: key
    });

    return this.s3Client.send(deleteCommand);
  }
}
