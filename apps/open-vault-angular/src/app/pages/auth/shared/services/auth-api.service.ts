import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { OTP_VERIFICATION_URL, SIGNIN_URL, SINGUP_URL } from 'apps/open-vault-angular/src/app/shared/constants';
import { ResponseObject } from 'apps/open-vault-angular/src/app/shared/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  http = inject(HttpClient);

  handleSignup(body: any) {
    return this.http.post(SINGUP_URL, body);
  }

  handleSignin(body: any): Observable<HttpErrorResponse | ResponseObject> {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      SIGNIN_URL,
      body
    );
  }

  handleOtpVerification(
    body: any
  ): Observable<HttpErrorResponse | ResponseObject> {
    return this.http.post<ResponseObject | HttpErrorResponse>(
      OTP_VERIFICATION_URL,
      body
    );
  }
}
