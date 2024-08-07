import { S3Client } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: env.STORAGE_API_URL,
  credentials: {
    accessKeyId: env.STORAGE_API_ACCESS_KEY,
    secretAccessKey: env.STORAGE_API_SECRET_KEY
  },
  forcePathStyle: true
})
