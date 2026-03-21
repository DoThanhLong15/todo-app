import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { JwtAuthGuard } from '@/modules/auth/guard/jwt.guard';
import { UserModule } from '@modules/user/user.module';

import { PrismaModule } from '@prisma/prisma.module';

import appConfig from '@config/app.config';
import bcryptConfig from '@config/bcrypt.config';
import databaseConfig from '@config/database.config';
import jwtConfig from '@config/jwt.config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, bcryptConfig, databaseConfig, jwtConfig],
    }),
    PrismaModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
