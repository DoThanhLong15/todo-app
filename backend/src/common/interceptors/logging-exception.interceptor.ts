import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - start;
          const statusCode = response.statusCode;

          this.logger.log(
            `${method} ${url} - ${statusCode} - ${responseTime}ms`,
          );
        },
        error: (err) => {
          this.logger.warn(`${method} ${url} - failed`);
        },
      }),
    );
  }
}
