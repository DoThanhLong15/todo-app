export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  REGISTER_SUCCESS: 'Register success. Please verify your email.',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully!',
} as const;

export const JWT_STRATEGIES = {
  ACCESS: 'jwt',
  REFRESH: 'jwt-refresh',
} as const;

export const JWT_ERROR_MESSAGES = {
  TOKEN_EXPIRED: 'Token expired',
  INVALID_TOKEN: 'Invalid token',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
} as const;

export const AUTH_VALIDATION_MESSAGES = {
  NAME: {
    REQUIRED: 'Name is required',
    MIN_LENGTH: 'Name must be at least 2 characters',
    MAX_LENGTH: 'Name must not exceed 50 characters',
    INVALID_FORMAT: 'Name must contain only letters and spaces',
  },
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID_FORMAT: 'Email is not valid',
    ALREADY_EXISTS: 'Email already exists',
    NOT_VERIFIED: 'Email is not verified!',
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 'Password must be at least 6 characters',
    MAX_LENGTH: 'Password must not exceed 50 characters',
  },
} as const;

export const AUTH_METADATA_KEYS = {
  IS_PUBLIC: 'isPublic',
} as const;