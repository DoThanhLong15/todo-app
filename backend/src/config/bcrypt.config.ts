import { registerAs } from '@nestjs/config';

import { getNumberEnvOrThrow } from '@config/helpers/env.helper';

import { APP_ENV_KEYS } from '@common/constants/app-env.constant';

export interface BcryptConfig {
  saltRounds: number;
}

export default registerAs('bcrypt', (): BcryptConfig => {
  const bcryptSaltRounds = getNumberEnvOrThrow(APP_ENV_KEYS.BCRYPT_SALT_ROUNDS);

  return {
    saltRounds: bcryptSaltRounds,
  };
});
