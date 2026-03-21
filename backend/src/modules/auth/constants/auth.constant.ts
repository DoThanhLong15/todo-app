export const AUTH_SERVICE_MESSAGE = {
  LOGIN: 'Login successfully!',
  LOGOUT: 'Logged out successfully!',
  REGISTER: 'Register success. Please verify your email.',
  REFRESH: 'Refresh token successfully!'
}

export const JWT_STRATEGY = 'jwt';
export const JWT_REFRESH_STRATEGY = 'jwt-refresh';

export const JWT_AUTH_MESSAGES = {
  IS_NOT_EMAIL_VERIFIED: 'Email is not verified!',
  EXPIRED_TOKEN: 'Token expired',
  INVALID_CREDENTIAL: 'Invalid credentials',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_TOKEN: 'Invalid token',
};

export const JWT_VALIDATION_MESSAGES = {
  NAME: {
    INVALID: 'Name must contain only letters and spaces',
    MAX: 'Name must not exceed 50 characters',
    MIN: 'Name must be at least 2 characters',
    REQUIRED: 'Name is required',
  },
  EMAIL: {
    EXIST: 'Email already exists',
    INVALID: 'Email is not valid',
    REQUIRED: 'Email is required',
  },
  PASSWORD: {
    MAX: 'Password must not exceed 50 characters',
    MIN: 'Password must be at least 6 characters',
    REQUIRED: 'Password is required',
  },
};

export const IS_PUBLIC_KEY = 'isPublic';