import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '@modules/auth/auth.service';
import { COMMON_STATUS_CODE } from '@common/constants/status-code.constant';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { JwtRefreshGuard } from '@modules/auth/guard/jwt-refresh.guard';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { Public } from '@modules/auth/decorators/public.decorator';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { UserWithRefreshToken } from '@modules/auth/interfaces/user-with-refresh-token.interface';

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
  refresh(@CurrentUser() user: UserWithRefreshToken) {
    return this.authService.refresh(user.userId, user.refreshToken);
  }

  @Post('logout')
  @HttpCode(COMMON_STATUS_CODE.SUCCESS)
  logout(@CurrentUser('userId') userId: string) {
    return this.authService.logout(userId);
  }
}
