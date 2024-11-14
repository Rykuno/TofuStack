import sharp, { type ResizeOptions } from 'sharp';
import { ConfigService } from '../common/configs/config.service';
import { inject, injectable } from '@needle-di/core';

@injectable()
export class ImagesService {
  constructor(private configService = inject(ConfigService)) {
  }

  private async resize(fileBuffer: Buffer, resizeOptions: ResizeOptions) {
    return sharp(fileBuffer).resize(resizeOptions).toBuffer();
  }
}
