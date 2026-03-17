import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage: any = 'Internal server error';
    let clientMessage = 'Something went wrong';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      errorMessage =
        typeof res === 'string' ? res : (res as any).message || res;

      if (status < 500) {
        clientMessage = errorMessage;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorMessage}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message: clientMessage,
    });
  }
}
