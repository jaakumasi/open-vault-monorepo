import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { REQUEST_OTP_URL, OTP_VERIFICATION_URL, SIGNIN_URL, SINGUP_URL, RESET_PASSWORD_URL } from 'apps/open-vault-angular/src/app/shared/constants';
import { PasswordReset, ResponseObject } from 'apps/open-vault-angular/src/app/shared/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  http = inject(HttpClient);

  handleSignup(body: any) {
    return this.http.post<ResponseObject | HttpErrorResponse>(SINGUP_URL, body);
  }

  handleSignin(body: any) {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      SIGNIN_URL,
      body
    );
  }

  handleOtpVerification(
    body: any
  ) {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      OTP_VERIFICATION_URL,
      body
    );
  }

  handleOtpRequest(body: {
    email: string;
  }) {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      REQUEST_OTP_URL,
      body
    );
  }

  handlePasswordReset(
    body: PasswordReset
  ): Observable<HttpErrorResponse | ResponseObject> {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      RESET_PASSWORD_URL,
      body
    );
  }

}
