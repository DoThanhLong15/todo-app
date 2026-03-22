import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  
  @Get('current-user')
  getMe(@CurrentUser() user: any) {
    return user;
  }
}