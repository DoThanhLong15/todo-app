import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { BaseResponse } from '@common/interfaces/base-response.interface';
import {
  handleHttpException,
  handleUnknownException,
} from '@common/utils/exception-handling.util';
import { logError } from '@common/utils/error-logging.util';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let error: BaseResponse;

    if (exception instanceof HttpException) {
      error = handleHttpException(exception, request);
    } else {
      error = handleUnknownException(exception, request);
    }

    logError(this.logger, request, error.statusCode, error.message, exception);

    return response.status(error.statusCode).json(error);
  }
}
