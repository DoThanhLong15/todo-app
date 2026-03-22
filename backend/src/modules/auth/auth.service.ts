import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {
  AUTH_SERVICE_MESSAGE,
  JWT_AUTH_MESSAGES,
  JWT_VALIDATION_MESSAGES,
} from '@modules/auth/constants/auth.constant';
import { BaseResponse } from '@common/interfaces/base-response.interface';
import { COMMON_STATUS_CODE } from '@common/constants/status-code.constant';
import { EXCEPTION_MESSAGE } from '@common/constants/message.constant';
import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';
import { JwtResponse } from '@modules/auth/interfaces/jwt-response.interface';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(dto: RegisterDto): Promise<BaseResponse> {
    const { email, password, name } = dto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(JWT_VALIDATION_MESSAGES.EMAIL.EXIST);
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
      statusCode: COMMON_STATUS_CODE.CREATED,
    };
  }

  async login(dto: LoginDto): Promise<BaseResponse> {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(JWT_AUTH_MESSAGES.INVALID_CREDENTIAL);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        JWT_VALIDATION_MESSAGES.EMAIL.IS_NOT_VERIFIED,
      );
    }

    return this.handleTokenIssuance(user, AUTH_SERVICE_MESSAGE.LOGIN);
  }

  async refresh(userId: string, refreshToken: string): Promise<BaseResponse> {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(JWT_AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      throw new UnauthorizedException(JWT_AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    return this.handleTokenIssuance(user, AUTH_SERVICE_MESSAGE.REFRESH);
  }

  async logout(userId: string): Promise<BaseResponse> {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException(EXCEPTION_MESSAGE.FORBIDDEN);
    }

    await this.userService.removeRefreshToken(userId);

    return {
      message: AUTH_SERVICE_MESSAGE.LOGOUT,
      statusCode: COMMON_STATUS_CODE.SUCCESS,
    };
  }

  private async generateTokens(user: any): Promise<JwtResponse>{
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

  private async handleTokenIssuance(user: any, message: string): Promise<BaseResponse<JwtResponse>> {
    const tokens = await this.generateTokens(user);

    const saltRounds = this.configService.get<number>('bcrypt.saltRounds');

    const hashedRefreshToken = await bcrypt.hash(
      tokens.refreshToken,
      saltRounds,
    );

    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      data: tokens,
      message,
      statusCode: COMMON_STATUS_CODE.SUCCESS,
    };
  }
}
