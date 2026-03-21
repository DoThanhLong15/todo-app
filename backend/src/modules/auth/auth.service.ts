import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AUTH_SERVICE_MESSAGE, JWT_AUTH_MESSAGES, JWT_VALIDATION_MESSAGES } from '@modules/auth/constants/auth.constant';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { UserService } from '@modules/user/user.service';
import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';
import { throwException } from '@common/utils/global-exception.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throwException(ConflictException, JWT_VALIDATION_MESSAGES.EMAIL.EXIST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
    });

    return {
      message: AUTH_SERVICE_MESSAGE.REGISTER,
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throwException(UnauthorizedException ,JWT_AUTH_MESSAGES.INVALID_CREDENTIAL);
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    if (!user.isEmailVerified) {
      throwException(ForbiddenException, JWT_AUTH_MESSAGES.INVALID_CREDENTIAL);
    }

    return this.handleTokenIssuance(user, AUTH_SERVICE_MESSAGE.LOGIN);
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return this.handleTokenIssuance(user,  AUTH_SERVICE_MESSAGE.REFRESH);
  }

  async logout(userId: string) {
    await this.userService.removeRefreshToken(userId);

    return {
      message:  AUTH_SERVICE_MESSAGE.LOGOUT,
    };
  }

  private async generateTokens(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles || [],
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async handleTokenIssuance(user: any, message: string) {
    const tokens = await this.generateTokens(user);

    const saltRounds = this.configService.get<number>('bcrypt.saltRounds');

    const hashedRefreshToken = await bcrypt.hash(
      tokens.refreshToken,
      saltRounds,
    );

    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      data: tokens,
      message
    };
  }
}
