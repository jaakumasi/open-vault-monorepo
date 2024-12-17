export const MIDDLEWARE_ATTACHMENTS = {
    USER: 'user'
}

export const SUCCESSFUL_REQUEST = {
    OTP_CREATED: 'Check email for OTP code',
    PASSWORD_RESSET_SUCCESS: 'Successfully reset password',
    SIGNIN_SUCCESS: 'Successfully signed in user',
    SIGNUP_SUCCESS: 'Successfully signed up user',
    VALID_OTP: 'OTP verified',
};

export const BAD_REQUEST = {
    ALREADY_VALIDATED: 'User is already OTP verified',
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    INVALID_CRED: 'Email or password is invalid',
    INVALID_OTP: 'OTP is invalid/expired',
    IS_SOCIAL_LOGIN: 'Social login field is required',
    MISMATCHING_OTP: 'Please provide the otp sent to YOUR email',
    NO_OR_INVALID_TOKEN: 'No/invalid token provided',
    PASSWORD_NOT_SET: 'You previously signed up using a social provider. Please set a password',
    REQUEST_OTP: 'Request an OTP to proceed',
    UNAUTHORIZED: 'You do not have access to this resource',
    UNAUTHORIZED_OTP: 'OTP is invalid/expired',
    UNAUTHORIZED_SIGNIN: 'Invalid email/password',
    UNVERIFIED_OTP:
        "You're not OTP verified. Please look in your mail for an OTP",
    USER_ALREADY_EXISTS: 'User with this email already exists',
    USER_DOES_NOT_EXIST: 'User with this email does not exist',
};

export const SERVER_ERRORS = {
    CREATE_USER: 'Could not create user',
    SERVER_ERROR: 'Could not process request',
}

export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    REDIRECT: 301,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
};

export const HASH = {
    SALT_ROUNDS: 10,
};

export const EXPIRY = {
    ACCESS_TOKEN_EXPIRATION_TIME: '1h',
    OTP_EXPIRATION_TIME: '3m',
};

export const MAIL_CONFIG = {
    MAIL_HOST: 'MAIL_HOST',
    MAIL_PORT: 'MAIL_PORT',
    MAIL_USER: 'MAIL_USER',
    MAIL_PASS: 'MAIL_PASS',
    MAIL_NAME: 'MAIL_NAME',
    MAIL_ADDRESS: 'MAIL_ADDRESS',
};

export const REDIRECT_TO = {
    HOME: '/home',
    OTP_VERIFICATION: '/auth/verify-otp',
    PASSWORD_RESET: '/auth/password-reset',
    SIGNIN: '/auth/signin',
};

export const COOKIES = {
    ACCESS_TOKEN: 'acctoken',
    REFRESH_TOKEN: 'refresh_token',
}

export const VERIFICATION_SCENARIO = {
    PASSWORD_RESET: "password-reset",
    FORM_SIGNUP: "form-signup",
    SOCIAL_SIGNUP: "social-signup",
}

export const REQUEST_HEADERS = {
    AUTHORIZATION: 'Authorization',
}