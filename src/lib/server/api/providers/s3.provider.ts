import { container } from 'tsyringe';
import { S3Client } from '@aws-sdk/client-s3';
import { s3Client } from '../packages/s3';

export const S3ClientProvider = Symbol('STORAGE_TOKEN');
export type S3ClientProvider = S3Client;
container.register<S3ClientProvider>(S3ClientProvider, {
  useValue: s3Client
});
