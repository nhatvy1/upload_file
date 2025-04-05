import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from './shared/interceptors/transform_interceptor'
import { useContainer } from 'class-validator'
import { AllExceptionsFilter } from './shared/exceptions/all_exception_filter'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const reflector = app.get(Reflector)

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  app.useGlobalFilters(new AllExceptionsFilter())

  const configService = app.get(ConfigService)
  const PORT = configService.get('port')

  await app.listen(PORT, () => console.log(`App is running on port ${PORT}`))
}
bootstrap()
