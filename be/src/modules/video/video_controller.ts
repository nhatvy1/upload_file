import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ResponseMessage } from 'src/shared/decorators/response_message_decorator'
import { MinioClientService } from '../minio/minio_service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('video')
export class VideoController {
  constructor(private readonly minioClient: MinioClientService) {}

  @Get('id')
  @ResponseMessage('success')
  @HttpCode(HttpStatus.OK)
  findById() {
    return 'success'
  }

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  createVideo(@UploadedFile() file: Express.Multer.File) {
    return this.minioClient.uploadFile(file)
  }
}
