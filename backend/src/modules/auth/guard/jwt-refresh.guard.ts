import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { handleAuthRequest } from '@modules/auth/utils/handle-auth-request.util';
import { JWT_AUTH_MESSAGES, JWT_REFRESH_STRATEGY } from '@modules/auth/constants/auth.constant';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_STRATEGY) {
  handleRequest(err: unknown, user: any) {
    return handleAuthRequest(err, user, JWT_AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
  }
}
