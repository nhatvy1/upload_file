import { Inject, Injectable } from '@nestjs/common'
import { Logger } from 'winston'
import { LOGGER } from './logger_constant'

@Injectable()
export class LoggerService {
  constructor(@Inject(LOGGER) private readonly logger: Logger) {}

  private defaultContext = 'Application'

  setContext(context: string) {
    this.defaultContext = context
  }

  info(message: string, metadata?: Record<string, any>) {
    this.logger.info(message, { ...metadata, context: this.defaultContext })
  }

  error(message: string, trace: string, metadata?: Record<string, any>) {
    this.logger.error(message, {
      ...metadata,
      trace,
      context: this.defaultContext
    })
  }

  // Other methods follow similar patterns
}
