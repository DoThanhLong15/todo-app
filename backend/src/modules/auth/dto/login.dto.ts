import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

import { AUTH_VALIDATION_MESSAGES } from '@common/constants/auth.constant';

export class LoginDto {
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL.INVALID_FORMAT })
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.EMAIL.REQUIRED })
  email: string;

  @IsString()
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.PASSWORD.REQUIRED })
  password: string;
}
