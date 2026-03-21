import { HttpException } from '@nestjs/common';

export function throwException(
  ExceptionClass: new (message: any) => HttpException,
  message: string | object,
): never {
  throw new ExceptionClass(message);
}