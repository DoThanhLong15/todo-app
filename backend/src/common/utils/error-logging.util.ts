import { Logger } from '@nestjs/common';
import { Request } from 'express';

export function logError(
  logger: Logger,
  request: Request,
  status: number,
  errorMessage: string | string[],
  exception?: unknown,
): void {
  const message = formatMessage(request, status, errorMessage);

  // const stack = getStackTrace(exception);
  // logger.error(message, stack);

  logger.error(message);
}

function formatMessage(
  request: Request,
  status: number,
  errorMessage: string | string[],
): string {
  const message = Array.isArray(errorMessage)
    ? errorMessage.join(', ')
    : errorMessage;

  return `${request.method} ${request.url} - ${status} - ${message}`;
}

function getStackTrace(exception?: unknown): string {
  if (exception instanceof Error) {
    return exception.stack ?? '';
  }
  return '';
}
