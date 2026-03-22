import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';
import { RefreshTokenPayload } from '@modules/auth/interfaces/refresh-token-payload.interface';

import { JWT_ENV_KEYS } from '@common/constants/jwt-env.constant';
import {
  JWT_ERROR_MESSAGES,
  JWT_STRATEGIES,
} from '@common/constants/auth.constant';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES.REFRESH,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        if (req?.cookies?.refreshToken) {
          return req.cookies.refreshToken;
        }

        return req.headers['x-refresh-token'];
      },
      secretOrKey: configService.get(JWT_ENV_KEYS.REFRESH_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload): Promise<RefreshTokenPayload> {
    const refreshToken =
      req.cookies?.refreshToken || req.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException(JWT_ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
