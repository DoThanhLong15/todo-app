import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { handleAuthRequest } from '@modules/auth/utils/handle-auth-request.util';
import { IS_PUBLIC_KEY, JWT_AUTH_MESSAGES, JWT_STRATEGY } from '@modules/auth/constants/auth.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    return handleAuthRequest(err, user, JWT_AUTH_MESSAGES.INVALID_TOKEN);
  }
}
