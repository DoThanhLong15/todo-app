import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { handleAuthRequest } from '@modules/auth/utils/handle-auth-request.util';

import {
  AUTH_METADATA_KEYS,
  JWT_ERROR_MESSAGES,
  JWT_STRATEGIES,
} from '@common/constants/auth.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGIES.ACCESS) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AUTH_METADATA_KEYS.IS_PUBLIC,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    return handleAuthRequest(err, user, JWT_ERROR_MESSAGES.INVALID_TOKEN);
  }
}
