import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ResponseMessage } from "src/shared/decorators/response_message_decorator";

@Controller('category')
export class VideoController {
  constructor() {}

  @Get('id')
  @ResponseMessage("success")
  @HttpCode(HttpStatus.OK)
  findById() {
    return "success"
  }
}
