import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { AUTH_VALIDATION_MESSAGES } from '@common/constants/auth.constant';  

export class RegisterDto {
  @IsString({ message: AUTH_VALIDATION_MESSAGES.NAME.REQUIRED })
  @MinLength(2, { message: AUTH_VALIDATION_MESSAGES.NAME.MIN_LENGTH })
  @MaxLength(50, { message: AUTH_VALIDATION_MESSAGES.NAME.MAX_LENGTH })
  @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, {
    message: AUTH_VALIDATION_MESSAGES.NAME.INVALID_FORMAT,
  })
  name: string;

  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL.INVALID_FORMAT })
  email: string;

  @IsString({ message: AUTH_VALIDATION_MESSAGES.PASSWORD.REQUIRED })
  @MinLength(6, { message: AUTH_VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH })
  @MaxLength(50, { message: AUTH_VALIDATION_MESSAGES.PASSWORD.MAX_LENGTH })
  password: string;
}
