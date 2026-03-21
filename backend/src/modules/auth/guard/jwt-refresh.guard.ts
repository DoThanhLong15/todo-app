import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { JWT_AUTH_MESSAGES, JWT_REFRESH_STRATEGY } from '@/modules/auth/constants/auth.constant';
import { handleAuthRequest } from '../utils/handle-auth-request.util';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_STRATEGY) {
  handleRequest(err: unknown, user: any) {
    return handleAuthRequest(err, user, JWT_AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
  }
}
