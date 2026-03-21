export const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];

  if (value === undefined || value === null || value === '') {
    throw new Error(`Environment variable ${key} is missing`);
  }

  return value;
};

export const getNumberEnvOrThrow = (key: string): number => {
  const value = Number(getEnvOrThrow(key));

  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }

  return value;
};
