import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

import { JWT_VALIDATION_MESSAGES } from '@modules/auth/constants/auth.constant';

export class LoginDto {
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: JWT_VALIDATION_MESSAGES.EMAIL.INVALID })
  @IsNotEmpty({ message: JWT_VALIDATION_MESSAGES.EMAIL.REQUIRED })
  email: string;

  @IsString()
  @IsNotEmpty({ message: JWT_VALIDATION_MESSAGES.PASSWORD.REQUIRED })
  password: string;
}
