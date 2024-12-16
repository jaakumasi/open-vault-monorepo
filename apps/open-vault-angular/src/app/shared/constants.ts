export const BREAKPOINTS = {
    XSMALL: '(max-width: 599.98px)',
    SMALL: '(min-width: 600px) and (max-width: 959.98px)',
    MEDIUM: '(min-width: 960px) and (max-width: 1279.98px)',
    LARGE: '(min-width: 1280px) and (max-width: 1919.98px)',
    XLARGE: '(min-width: 1920px)',
};

export const STORAGE_KEYS = {
    TOKEN: 'token',
    EMAIL: 'mail'
}

/* Client Endpoints */
export const CLIENT_ENDPOINTS = {
    /* AUTH */
    SIGNIN: 'auth/signin',
    SIGNUP: 'auth/signup',
    OTP_VERIFICATION: 'auth/verify-otp',
    OTP_REQUEST: 'auth/request-otp',
    PASSWORD_RESET: 'auth/reset-password',
    HOME: 'books'
};

/* Server Endpoints */
export const SERVER_URL = 'http://127.0.0.1:3000';

export const SIGNIN_URL = `${SERVER_URL}/api/v1/auth/signin`
export const SINGUP_URL = `${SERVER_URL}/api/v1/auth/signup`
export const OTP_VERIFICATION_URL = `${SERVER_URL}/api/v1/auth/verify-otp`

