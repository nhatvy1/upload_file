import {
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { MINIO_CLIENT } from './minio_constant'
import * as Minio from 'minio'
import { ConfigService } from '@nestjs/config'
import { BufferedFile } from './buffered_file'
import { urlResponseFromMinio } from 'src/utils/mino_client'
import { RequestHeaders } from 'minio/dist/main/internal/type'

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
      filename,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype
      }
    )

    const url = urlResponseFromMinio({
      port: this.configService.get('minio_client.port'),
      filename: filename,
      bucket_name: this.bucketName
    })

    return url
  }

  async uploadVideo(file: Express.Multer.File) {
    const filename = `${Date.now()}-${file.originalname}`

    await this.minioClient.putObject(
      this.bucketName,
      filename,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype
      }
    )

    const videoUrl = urlResponseFromMinio({
      port: this.configService.get('minio_client.port'),
      filename: filename,
      bucket_name: this.bucketName
    })

    return videoUrl
  }

  initMutilplepartUpload(objectName: string) {
    return this.minioClient.initiateNewMultipartUpload(
      this.bucketName,
      objectName,
      {}
    )
  }

  async uploadChunk(
    fileName: string,
    uploadId: string,
    partNumber: number,
    chunk: Buffer
  ) {
    const result = await this.minioClient.putObject(
      this.bucketName,
      `${fileName}_${partNumber}`,
      chunk
    )
    return result
  }

  async completeUploadFile(finalFileName: string, chunkNames: string[]) {
    const destObjConfig = new Minio.CopyDestinationOptions({
      Bucket: this.bucketName,
      Object: finalFileName
    })

    const sourceObjList = chunkNames.map(
      (chunkName) =>
        new Minio.CopySourceOptions({
          Bucket: this.bucketName,
          Object: chunkName
        })
    )
    await this.minioClient.composeObject(destObjConfig, sourceObjList)
  }

  async deleteChunks(chunkNames: string[]) {
    await this.minioClient.removeObjects(this.bucketName, chunkNames)
  }
}
