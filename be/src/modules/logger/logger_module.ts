import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from './logger_service'
import { createLogger } from './logger_config'
import { LOGGER } from './logger_constant'

@Module({
  providers: [
    LoggerService,
    {
      provide: LOGGER,
      useFactory: (configService: ConfigService) => createLogger(configService),
      inject: [ConfigService]
    }
  ],
  exports: [LoggerService]
})
export class LoggerModule {}
