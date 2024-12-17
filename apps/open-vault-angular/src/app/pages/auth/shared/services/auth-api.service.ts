import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { REQUEST_OTP_URL, OTP_VERIFICATION_URL, SIGNIN_URL, SINGUP_URL, RESET_PASSWORD_URL } from 'apps/open-vault-angular/src/app/shared/constants';
import { FormSignupRequest, OTPRequest, OTPVerificationRequest, PasswordResetRequest, ResponseObject, SocialSignupRequest } from 'apps/open-vault-angular/src/app/shared/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  http = inject(HttpClient);

  handleSignup(body: FormSignupRequest) {
    return this.http.post<ResponseObject | HttpErrorResponse>(SINGUP_URL, body);
  }

  handleSignin(body: FormSignupRequest | SocialSignupRequest) {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      SIGNIN_URL,
      body
    );
  }

  handleOtpVerification(
    body: OTPVerificationRequest
  ) {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      OTP_VERIFICATION_URL,
      body
    );
  }

  handleOtpRequest(body: OTPRequest) {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      REQUEST_OTP_URL,
      body
    );
  }

  handlePasswordReset(
    body: PasswordResetRequest
  ): Observable<HttpErrorResponse | ResponseObject> {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      RESET_PASSWORD_URL,
      body
    );
  }

}
