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

export const VERIFICATION_SCENARIO = {
    PASSWORD_RESET: 'password-reset',
    FORM_SIGNUP: 'form-signup',
    SOCIAL_SIGNUP: 'social-signup',
}

export const REDIRECTION_TIMEOUT = 2000;

export const DEFAULT_TOAST_TIMEOUT = 3000;

/* Client Endpoints */
export const CLIENT_ENDPOINTS = {
    /* Auth */
    SIGNIN: 'auth/signin',
    SIGNUP: 'auth/signup',
    OTP_VERIFICATION: 'auth/verify-otp',
    OTP_REQUEST: 'auth/request-otp',
    PASSWORD_RESET: 'auth/reset-password',
    /* Books */
    HOME: 'books',
    MANAGE_BOOKS: 'books/manage'
};

/* Server Endpoints */
const SERVER_URL = 'http://127.0.0.1:3000';
/* Auth */
export const SIGNIN_URL = `${SERVER_URL}/api/v1/auth/signin`;
export const SINGUP_URL = `${SERVER_URL}/api/v1/auth/signup`
export const OTP_VERIFICATION_URL = `${SERVER_URL}/api/v1/auth/verify-otp`;
export const REQUEST_OTP_URL = `${SERVER_URL}/api/v1/auth/request-otp`;
export const RESET_PASSWORD_URL = `${SERVER_URL}/api/v1/auth/reset-password`;
/* Books */
export const GET_BOOKS_URL = `${SERVER_URL}/api/v1/books`;
export const SEARCH_BOOKS_URL = `${SERVER_URL}/api/v1/books/search`;
export const UPLOAD_BOOK_URL = `${SERVER_URL}/api/v1/books/upload`;


