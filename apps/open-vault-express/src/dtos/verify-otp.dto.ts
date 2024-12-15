import {
    IsDefined,
    IsEnum,
    IsString,
    Matches
} from 'class-validator';
import { VerificationScenario } from '../shared/types';

enum VerificationScenarioEnum {
    passwordReset = 'passwordReset',
    formSignup = 'formSignup',
    socialSignup = 'socialSignup'
}

export class VerifyOtpDto {
    @IsString()
    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    email: string;

    @IsDefined()
    @IsString()
    otp: string;

    @IsDefined()
    @IsEnum(VerificationScenarioEnum)
    verificationScenario: VerificationScenario;
}
