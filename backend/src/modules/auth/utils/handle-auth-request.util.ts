import { UnauthorizedException } from '@nestjs/common';

import { UserPayload } from '@modules/auth/interfaces/user-payload.interface';
import { throwException } from '@/common/utils/exception-handling.util';

export function handleAuthRequest<T extends UserPayload>(
  err: unknown,
  user: T,
  message: string,
): T {
  if (err || !user) {
    throw err || throwException(UnauthorizedException, message);
  }
  return user;
}
