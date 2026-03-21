import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';
import { JWT_REFRESH_STRATEGY } from '@/modules/auth/constants/auth.constant';
import { UserWithRefreshToken } from '@modules/auth/interfaces/user-with-refresh-token.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_STRATEGY,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        if (req?.cookies?.refreshToken) {
          return req.cookies.refreshToken;
        }

        return req.headers['x-refresh-token'];
      },
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload): Promise<UserWithRefreshToken> {
    const refreshToken =
      req.cookies?.refreshToken || req.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
