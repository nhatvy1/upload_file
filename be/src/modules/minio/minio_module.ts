import { Module } from '@nestjs/common'
import { MinioClientProvdier } from './minio_provider'
import { MinioClientService } from './minio_service'
import { LoggerModule } from '../logger/logger_module'

@Module({
  imports: [LoggerModule],
  providers: [MinioClientProvdier, MinioClientService],
  exports: [MinioClientProvdier, MinioClientService]
})
export class MinioClientModule {}
