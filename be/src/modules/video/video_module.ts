import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { VideoController } from './video_controller'
import { VideoService } from './video_service'

@Module({
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoModule {}
