import { IsDefined, IsString, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @IsDefined()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  email: string;
}
