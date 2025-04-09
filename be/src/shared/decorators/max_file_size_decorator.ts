import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileSizeInterceptor } from '../interceptors/file_size_interceptor'

export const MAX_FILE_SIZE = 'maxFileSize'

export const MaxFileSize = (bytes: number) => {
  return SetMetadata(MAX_FILE_SIZE, bytes)
}

export const UploadFile = (fieldname: string, maxSize?: number) => {
  return applyDecorators(
    MaxFileSize(maxSize),
    UseInterceptors(FileInterceptor(fieldname), FileSizeInterceptor)
  )
}
