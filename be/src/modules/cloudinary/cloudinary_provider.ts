import { v2 } from 'cloudinary'
import { CLOUDINARY } from './constant'
import { ConfigService } from '@nestjs/config'

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    return v2.config({
      cloud_name: configService.get('cloudinary.name'),
      api_key: configService.get('cloudinary.apiKey'),
      api_secret: configService.get('cloudinary.apiSecret')
    })
  }
}
