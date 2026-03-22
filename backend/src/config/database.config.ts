import { registerAs } from '@nestjs/config';

import { getEnvOrThrow, getNumberEnvOrThrow } from '@config/helpers/env.helper';

import { DB_ENV_KEYS } from '@common/constants/db-env.constant';

export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export default registerAs('database', (): DatabaseConfig => {
  const databaseUrl = getEnvOrThrow(DB_ENV_KEYS.URL);

  let parsed: URL;

  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL is not a valid URL');
  }

  const port = getNumberEnvOrThrow(DB_ENV_KEYS.PORT);

  return {
    url: databaseUrl,
    host: parsed.hostname,
    port,
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
  };
});
