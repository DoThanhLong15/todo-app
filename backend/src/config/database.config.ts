import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  url: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
}

export default registerAs('database', (): DatabaseConfig => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in .env');
  }

  const parsed = new URL(databaseUrl);

  return {
    url: databaseUrl,
    host: parsed.hostname,
    port: Number(parsed.port) || 5432,
    username: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace('/', ''),
  };
});