import { Provider } from '@nestjs/common'
import { MINIO_CLIENT } from './minio_constant'
import { ConfigService } from '@nestjs/config'
import * as Minio from 'minio'
import { LoggerService } from '../logger/logger_service'

export const MinioClientProvdier: Provider = {
  provide: MINIO_CLIENT,
  useFactory: (configService: ConfigService, logger: LoggerService) => {
    const minioClient = new Minio.Client({
      endPoint: configService.get('minio_client.endpoint'),
      port: configService.get('minio_client.port'),
      useSSL: configService.get('minio_client.ssl') === 'true',
      accessKey: configService.get('minio_client.access_key'),
      secretKey: configService.get('minio_client.secret_key')
    })
    logger.info('Minio client initialized successfully')
    return minioClient
  },
  inject: [ConfigService, LoggerService]
}
