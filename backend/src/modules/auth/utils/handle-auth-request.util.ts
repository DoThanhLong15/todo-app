import { UnauthorizedException } from '@nestjs/common';

import { UserPayload } from '@modules/user/interfaces/user-payload.interface';

export function handleAuthRequest<T extends UserPayload>(
  err: unknown,
  user: T,
  message: string,
): T {
  if (err || !user) {
    throw err ||  new UnauthorizedException(message);
  }
  return user;
}
