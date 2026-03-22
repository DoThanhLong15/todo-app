import { registerAs } from '@nestjs/config';

import { getEnvOrThrow, getNumberEnvOrThrow } from '@config/helpers/env.helper';

import { APP_ENV_KEYS } from '@common/constants/app-env.constant';

export interface AppConfig {
  port: number;
  nodeEnv: string;
}

export default registerAs('app', (): AppConfig => {
  const port = getNumberEnvOrThrow(APP_ENV_KEYS.SERVER_HOST);
  const nodeEnv = getEnvOrThrow(APP_ENV_KEYS.NODE_ENV);

  return {
    port,
    nodeEnv,
  };
});
