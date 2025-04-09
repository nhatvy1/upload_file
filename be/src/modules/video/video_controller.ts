import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ResponseMessage } from 'src/shared/decorators/response_message_decorator'
import { MinioClientService } from '../minio/minio_service'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadVideoDto } from './dto/upload_video'
import {
  MaxFileSize,
  UploadFile
} from 'src/shared/decorators/max_file_size_decorator'
import { FileSizeInterceptor } from 'src/shared/interceptors/file_size_interceptor'
import { sleep } from 'src/utils/sleep'

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
  createImage(@UploadedFile() file: Express.Multer.File) {
    return this.minioClient.uploadFile(file)
  }

  @Post('upload')
  @UploadFile('file', 5)
  uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadVideoDto
  ) {
    console.log('check body: ', body)
    console.log('check file: ', file)

    return 1
  }

  @Post('init')
  async initUpload(@Body() body: { filename: string }) {
    const uploadId = await this.minioClient.initMutilplepartUpload(
      body.filename
    )
    return { uploadId }
  }

  @Post('chunk')
  @ResponseMessage('success')
  @UploadFile('file', 5)
  async testUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { filename: string; uploadId: string; partNumber: string }
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded')
    }

    const { filename, uploadId, partNumber } = body
    if (!filename || !uploadId || !partNumber) {
      throw new BadRequestException('Missing required parameters')
    }

    const partData = file.buffer
    const result = await this.minioClient.uploadChunk(
      filename,
      uploadId,
      parseInt(partNumber),
      partData
    )
    return result
  }

  @Post('merge')
  async mergeChunks(@Body() body: { filename: string; totalChunks: number }) {
    const { filename, totalChunks } = body
    const chunkNames = Array.from(
      { length: totalChunks },
      (_, i) => {
        return `${filename}_${i + 1}`
      }
    )

    await this.minioClient.completeUploadFile(filename, chunkNames)
    await this.minioClient.deleteChunks(chunkNames)

    return { success: true, filename }
  }
}
