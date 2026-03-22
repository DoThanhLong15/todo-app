import { registerAs } from '@nestjs/config';

import { getNumberEnvOrThrow } from '@config/helpers/env.helper';

export interface BcryptConfig {
  saltRounds: number;
}

export default registerAs('bcrypt', (): BcryptConfig => {
  const bcryptSaltRounds = getNumberEnvOrThrow('BCRYPT_SALT_ROUNDS');

  return {
    saltRounds: bcryptSaltRounds,
  };
});
