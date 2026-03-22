import { HttpException } from '@nestjs/common';
import { Request } from 'express';

import { BaseResponse } from '@common/interfaces/base-response.interface';
import { COMMON_STATUS_CODE } from '@common/constants/status-code.constant';
import { EXCEPTION_MESSAGE } from '@common/constants/message.constant';

export function handleHttpException(
  exception: HttpException,
  request: Request,
): BaseResponse {
  const statusCode = exception.getStatus();
  const message = extractHttpExceptionMessage(exception);

  return buildErrorResponse(statusCode, message, request.url);
}

export function handleUnknownException(
  exception: unknown,
  request: Request,
): BaseResponse {
  const message = extractUnknownExceptionMessage(exception);

  return buildErrorResponse(
    COMMON_STATUS_CODE.INTERNAL_SERVER_ERROR,
    message,
    request.url,
  );
}

function extractHttpExceptionMessage(
  exception: HttpException,
): string | string[] {
  const response = exception.getResponse();

  if (typeof response === 'string') return response;

  if (isObject(response) && 'message' in response) {
    return (response as { message: string | string[] }).message;
  }

  return exception.message || EXCEPTION_MESSAGE.INTERNAL_SERVER_ERROR;
}

function extractUnknownExceptionMessage(exception: unknown): string {
  if (exception instanceof Error) {
    return exception.message;
  }

  return EXCEPTION_MESSAGE.INTERNAL_SERVER_ERROR;
}

function buildErrorResponse(
  statusCode: number,
  message: string | string[],
  path: string,
): BaseResponse {
  return {
    success: false,
    statusCode,
    message,
    path,
    timestamp: new Date().toISOString(),
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
