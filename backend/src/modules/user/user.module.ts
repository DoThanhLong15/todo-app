import { Module } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';
import { UserService } from '@modules/user/user.service';
import { UserController } from '@modules/user/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
