import { registerAs } from '@nestjs/config';
import { getEnvOrThrow, getNumberEnvOrThrow } from './helpers/env.helper';

export interface AppConfig {
  port: number;
  nodeEnv: string;
}

export default registerAs('app', (): AppConfig => {
  const port = getNumberEnvOrThrow('SERVER_PORT');
  const nodeEnv = getEnvOrThrow('NODE_ENV');

  return {
    port,
    nodeEnv,
  };
});
