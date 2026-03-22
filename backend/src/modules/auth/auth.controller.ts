import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';

import { AuthService } from '@modules/auth/auth.service';
import { JwtRefreshGuard } from '@modules/auth/guard/jwt-refresh.guard';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { Public } from '@common/decorators/public.decorator';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { RefreshTokenPayload } from '@modules/auth/interfaces/refresh-token-payload.interface';

import { COMMON_STATUS_CODE } from '@common/constants/status-code.constant';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @HttpCode(COMMON_STATUS_CODE.SUCCESS)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(COMMON_STATUS_CODE.SUCCESS)
  @UseGuards(JwtRefreshGuard)
  refresh(@CurrentUser() user: RefreshTokenPayload) {
    return this.authService.refresh(user.userId, user.refreshToken);
  }

  @Post('logout')
  @HttpCode(COMMON_STATUS_CODE.SUCCESS)
  logout(@CurrentUser('userId') userId: string) {
    return this.authService.logout(userId);
  }
}
