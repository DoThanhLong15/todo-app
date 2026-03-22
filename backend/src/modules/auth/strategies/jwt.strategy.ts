import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';
import { UserPayload } from '@modules/user/interfaces/user-payload.interface';

import { JWT_ENV_KEYS } from '@common/constants/jwt-env.constant';
import { JWT_STRATEGIES } from '@common/constants/auth.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES.ACCESS,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_ENV_KEYS.ACCESS_SECRET),
    });
  }

  async validate(payload: JwtPayload): Promise<UserPayload> {
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
