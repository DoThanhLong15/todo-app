import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { handleAuthRequest } from '@modules/auth/utils/handle-auth-request.util';

import {
  JWT_ERROR_MESSAGES,
  JWT_STRATEGIES,
} from '@common/constants/auth.constant';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_STRATEGIES.REFRESH) {
  handleRequest(err: unknown, user: any) {
    return handleAuthRequest(
      err,
      user,
      JWT_ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
    );
  }
}
