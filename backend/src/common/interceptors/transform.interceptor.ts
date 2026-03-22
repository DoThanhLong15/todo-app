import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

import { BaseResponse } from '@common/interfaces/base-response.interface';
import { COMMON_MESSAGES } from '@common/constants/message.constant';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map(
        (response: any): BaseResponse => ({
          success: true,
          statusCode: response.statusCode,
          message: response?.message || COMMON_MESSAGES.SUCCESS,
          path: request.url,
          timestamp: new Date().toISOString(),
          data: response?.data ?? response,
        }),
      ),
    );
  }
}
