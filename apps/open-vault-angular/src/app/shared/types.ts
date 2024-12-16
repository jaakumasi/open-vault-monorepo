export enum SCREEN_SIZE {
    'xsmall' = 'xsmall',
    'small' = 'small',
    'medium' = 'medium',
    'large' = 'large',
    'xlarge' = 'xlarge',
}

export interface GlobalState {
    screenSize: SCREEN_SIZE;
    user: User | null;
};

export interface User {
    id: string;
    email: string;
    otpVerified: true;
    socialLoginProvider: SocialLoginProvider;
    books: Book[],
    role: UserRole
};

export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    bookUrl: string;
    totalPages: string;
    users: User[];
}

export interface SocialLoginProvider {
    name: string;
    profilePicUrl: string;
    provider: string;
};

export type UserRole = "user" | "superUser"

export interface GoogleUser {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    nbf: number;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
    jti: string;
}

export interface FormSignupRequest {
    email: string;
    password: string;
    isSocialLogin: boolean;
}

export interface SocialSignupRequest {
    email: string;
    isSocialLogin: boolean;
    socialLoginProvider: {
        name: string;
        profilePictureUrl: string;
        provider: string;
    };
}

export interface ResponseObject {
    statusCode: number;
    message?: string;
    data?: any
};

export interface PasswordReset {
    email: string;
    password: string;
}
