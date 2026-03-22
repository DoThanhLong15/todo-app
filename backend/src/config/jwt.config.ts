import { registerAs } from '@nestjs/config';

import { getEnvOrThrow } from '@config/helpers/env.helper';

import { JWT_ENV_KEYS } from '@common/constants/jwt-env.constant';

export interface JwtConfig {
  accessExpiresIn: string;
  accessSecret: string;
  refreshExpiresIn: string;
  refreshSecret: string;
}

export default registerAs('jwt', (): JwtConfig => {
  const accessExpiresIn = getEnvOrThrow(JWT_ENV_KEYS.ACCESS_EXPIRES);
  const accessSecret = getEnvOrThrow(JWT_ENV_KEYS.ACCESS_SECRET);
  const refreshExpiresIn = getEnvOrThrow(JWT_ENV_KEYS.REFRESH_EXPIRES);
  const refreshSecret = getEnvOrThrow(JWT_ENV_KEYS.REFRESH_SECRET);

  return {
    accessExpiresIn,
    accessSecret,
    refreshExpiresIn,
    refreshSecret,
  };
});
