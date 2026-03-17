import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: string;
}

export default registerAs('app', (): AppConfig => {
  const serverPort = process.env.SERVER_PORT;

  if (!serverPort) {
    throw new Error('Server Port is not defined in .env');
  }

  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    port: parseInt(serverPort, 10),
    nodeEnv
  };
});