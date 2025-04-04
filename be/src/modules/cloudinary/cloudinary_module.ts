import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary_provider';
import { CloudinaryService } from './cloudinary_service';
@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}