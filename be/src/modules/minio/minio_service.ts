import { Inject, Injectable } from '@nestjs/common'
import { MINIO_CLIENT } from './minio_constant'
import * as Minio from 'minio'
import { ConfigService } from '@nestjs/config'
import { BufferedFile } from './buffered_file'

@Injectable()
export class MinioClientService {
  private readonly bucketName: string

  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Minio.Client,
    private readonly configService: ConfigService
  ) {
    this.bucketName = this.configService.get('minio_client.bucket_name')
  }

  async uploadFile(file: BufferedFile) {
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.originalname}`

    const result = await this.minioClient.putObject(
      this.bucketName,
      file.originalname,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype
      }
    )
    return {
      url: `http://:${this.minioClient.port}/${this.bucketName}/${file.originalname}`,
      filename,
      result
    }
  }
}
