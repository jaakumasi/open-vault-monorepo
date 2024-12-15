import {
    IsBoolean,
    IsDefined,
    IsOptional,
    IsString,
    Matches
} from 'class-validator';
import { BAD_REQUEST } from '../shared/constants';

export class UserAuthDto {
    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Invalid email' })
    @IsDefined({ message: BAD_REQUEST.EMAIL_REQUIRED })
    email: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsBoolean()
    @IsDefined({ message: BAD_REQUEST.IS_SOCIAL_LOGIN })
    isSocialLogin: boolean;

    @IsOptional()
    socialLoginProvider?: {
        name: string,
        profilePictureUrl: string,
        provider: string
    }
}
