import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageDisplayComponent } from "../../../shared/components/message-display/message-display.component";
import { REDIRECTION_TIMEOUT, STORAGE_KEYS, VERIFICATION_SCENARIO } from '../../../shared/constants';
import { ResponseObject } from '../../../shared/types';
import { AuthApiService } from '../shared/services/auth-api.service';
import { OpenVaultBannerComponent } from "../../../shared/components/open-vault-banner/open-vault-banner.component";


@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MessageDisplayComponent,
    OpenVaultBannerComponent
  ],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
  providers: [AuthApiService]
})
export class VerifyOtpComponent implements OnInit {
  authApiService = inject(AuthApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  message = signal('Please enter the OTP sent to your email');
  allowResend = signal(false);
  isVerifying = signal(false);
  isVerificationComplete = signal(false);
  showErrorResponse = signal(false);
  isOtpInvalid = signal(false);
  errorResponse = signal('');
  requestOtpWaitTime = signal(60);
  formattedWaitTime = signal('00:00');
  intervalRef!: any;

  otpInput1 = '';
  otpInput2 = '';
  otpInput3 = '';
  otpInput4 = '';
  inputRegex = /\d/;

  ngOnInit(): void {
    /* set the otp verification screen message to the parsed query param
     * if its exists. */
    this.route.queryParamMap.subscribe((qparams) => {
      const qparamMsg = qparams.get('message');
      if (qparamMsg) this.message.set(qparamMsg);
    });
    /* start the resend coundown */
    this.countdownTimer();
  }

  onOtpChange(value: string, ref: HTMLInputElement | null) {
    /* ignore otp input changes if OTP verification is ongoing */
    if (this.isVerifying()) return;
    /* submit if all fields have numeric inputs */
    if (
      this.inputRegex.test(this.otpInput1) &&
      this.inputRegex.test(this.otpInput2) &&
      this.inputRegex.test(this.otpInput3) &&
      this.inputRegex.test(this.otpInput4)
    ) {
      this.onSubmit();
      return;
    }
    /* move focus to next otp field if the current input is a number */
    const matches = this.inputRegex.test(value);
    if (matches && ref) ref.focus();
  }

  onSubmit() {
    this.onRequestStart();

    const otp =
      this.otpInput1 + this.otpInput2 + this.otpInput3 + this.otpInput4;
    const requestBody = {
      otp,
      email: this.getEmail(),
      verificationScenario: this.getVerificationScenario(),
    };
    this.authApiService.handleOtpVerification(requestBody).subscribe({
      next: (response: any) => this.handleSuccessResponse(response),
      error: (response: HttpErrorResponse) =>
        this.handleErrorResponse(response),
    });
  }

  handleSuccessResponse(response: ResponseObject) {
    this.onRequestEnd();
    this.isOtpInvalid.set(false);
    clearInterval(this.intervalRef);
    this.allowResend.set(false);
    this.isVerificationComplete.set(true);

    const redirectTo = response.data?.redirectTo!;

    setTimeout(async () => {
      await this.router.navigateByUrl(redirectTo);
    }, REDIRECTION_TIMEOUT);
  }

  handleErrorResponse(response: HttpErrorResponse) {
    this.onRequestEnd();
    this.isOtpInvalid.set(true);
    this.errorResponse.set(response.error.message);
    this.showErrorResponse.set(true);
  }

  onRequestStart() {
    this.isVerifying.set(true);
  }

  onRequestEnd() {
    this.isVerifying.set(false);
  }

  getEmail() {
    return globalThis.window?.localStorage.getItem(STORAGE_KEYS.EMAIL);
  }

  /**
   * OTP verification is done during signup (using form or social signin provider)
   * or password reset.
   */
  getVerificationScenario() {
    const url = this.router.url;
    return url.endsWith(VERIFICATION_SCENARIO.PASSWORD_RESET)
      ? "passwordReset"
      : url.endsWith(VERIFICATION_SCENARIO.FORM_SIGNUP)
        ? "formSignup"
        : "socialSignup";
  }

  onResendOtp() {
    this.allowResend.set(false);
    const requestBody = {
      email: this.getEmail()!,
    };
    this.authApiService.handleOtpRequest(requestBody).subscribe({
      next: (response: any) => {
        console.log(response);
        this.requestOtpWaitTime.set(60);
        this.countdownTimer();
      },
      // error: (response: HttpErrorResponse) => {
      //   console.log(response);
      // },
    });
  }

  countdownTimer() {
    this.intervalRef = setInterval(() => {
      if (this.requestOtpWaitTime() == 0) {
        clearInterval(this.intervalRef);
        this.allowResend.set(true);
        return;
      }
      this.requestOtpWaitTime.update((currTime) => currTime - 1);
      const mins = Math.floor(this.requestOtpWaitTime() / 60);
      const secs = this.requestOtpWaitTime() % 60;
      const minString = mins.toString().padStart(2, '0');
      const secString = secs.toString().padStart(2, '0');
      this.formattedWaitTime.set(`${minString}:${secString}`);
    }, 1000);
  }
}
