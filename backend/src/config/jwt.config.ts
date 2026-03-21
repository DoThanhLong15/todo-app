import { registerAs } from '@nestjs/config';
import { getEnvOrThrow } from '@config/helpers/env.helper';

export interface JwtConfig {
  accessExpiresIn: string;
  accessSecret: string;
  refreshExpiresIn: string;
  refreshSecret: string;
}

export default registerAs('jwt', (): JwtConfig => {
  const accessExpiresIn = getEnvOrThrow('JWT_ACCESS_EXPIRES');
  const accessSecret = getEnvOrThrow('JWT_ACCESS_SECRET');
  const refreshExpiresIn = getEnvOrThrow('JWT_REFRESH_EXPIRES');
  const refreshSecret = getEnvOrThrow('JWT_REFRESH_SECRET');

  return {
    accessExpiresIn,
    accessSecret,
    refreshExpiresIn,
    refreshSecret,
  };
});
