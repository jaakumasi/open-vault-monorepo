import { IsDefined, IsString, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsDefined()
  password: string;

  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  @IsDefined()
  email: string;
}
