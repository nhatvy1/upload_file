import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { MAX_FILE_SIZE } from '../decorators/max_file_size_decorator'
import { maxFileUploadValue } from '../global/max_file_upload'

@Injectable()
export class FileSizeInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const maxSize = maxFileUploadValue(
      this.reflector.get<number>(MAX_FILE_SIZE, context.getHandler())
    )

    const request = context.switchToHttp().getRequest()
    const file = request.file

    if (file && file.size > maxSize) {
      throw new Error(
        `File size exceeds the limit of ${maxSize / 1024 / 1024}MB`
      )
    }

    return next.handle()
  }
}
