import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { MongooseModule } from '@nestjs/mongoose'
import { VideoModule } from './modules/video/video_module'
import { LoggerModule } from './modules/logger/logger_module'
import { MinioClientModule } from './modules/minio/minio_module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration]
    }),
    LoggerModule,
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('database'),
    //     maxPoolSize: 5,
    //     connectionFactory: (connection) => {
    //       const mongoLogger = new Logger('DATABASE')
    //       connection.on('connected', () => {
    //         mongoLogger.verbose('Connected to database successfully')
    //       })
    //       connection._events.connected()
    //       return connection
    //     }
    //   }),
    // }),
    MinioClientModule,
    VideoModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
