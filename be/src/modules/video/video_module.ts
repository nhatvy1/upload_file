import { Module } from '@nestjs/common'
import { VideoController } from './video_controller'
import { VideoService } from './video_service'
import { MinioClientService } from '../minio/minio_service'
import { MinioClientModule } from '../minio/minio_module'

@Module({
  imports: [MinioClientModule],
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoModule {}
