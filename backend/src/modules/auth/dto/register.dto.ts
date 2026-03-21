import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { JWT_VALIDATION_MESSAGES } from '@modules/auth/constants/auth.constant';

export class RegisterDto {
  @IsString({ message: JWT_VALIDATION_MESSAGES.NAME.REQUIRED })
  @MinLength(2, { message: JWT_VALIDATION_MESSAGES.NAME.MIN })
  @MaxLength(50, { message: JWT_VALIDATION_MESSAGES.NAME.MAX })
  @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, {
    message: JWT_VALIDATION_MESSAGES.NAME.INVALID,
  })
  name: string;

  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: JWT_VALIDATION_MESSAGES.EMAIL.INVALID })
  email: string;

  @IsString({ message: JWT_VALIDATION_MESSAGES.PASSWORD.REQUIRED })
  @MinLength(6, { message: JWT_VALIDATION_MESSAGES.PASSWORD.MIN })
  @MaxLength(50, { message: JWT_VALIDATION_MESSAGES.PASSWORD.MAX })
  password: string;
}
