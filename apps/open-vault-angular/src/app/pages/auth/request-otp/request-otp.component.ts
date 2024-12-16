import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActionBtnComponent } from '../../../shared/components/action-btn/action-btn.component';
import { MessageDisplayComponent } from '../../../shared/components/message-display/message-display.component';
import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { InvalidInputMessageComponent } from '../../../shared/components/invalid-input-message/invalid-input-message.component';
import { AuthApiService } from '../shared/services/auth-api.service';
import { CLIENT_ENDPOINTS, STORAGE_KEYS, VERIFICATION_SCENARIO } from '../../../shared/constants';
import { emailValidator } from '../../../shared/validators/email.validator';
import { OpenVaultBannerComponent } from "../../../shared/components/open-vault-banner/open-vault-banner.component";


@Component({
  selector: 'app-request-otp',
  standalone: true,
  imports: [
    ActionBtnComponent,
    CommonModule,
    MessageDisplayComponent,
    FormControlComponent,
    InvalidInputMessageComponent,
    ReactiveFormsModule,
    RouterLink,
    OpenVaultBannerComponent
],
  templateUrl: './request-otp.component.html',
})
export class RequestOtpComponent implements OnInit {
  formBuiilder = inject(FormBuilder);
  authApiService = inject(AuthApiService);
  router = inject(Router);

  requestOtpForm!: FormGroup;
  signinPage = signal(CLIENT_ENDPOINTS.SIGNIN);
  isFormValid = signal(false);
  isMakingRequest = signal(false);
  showNonExistingUserError = signal(false);
  httpErrorResponse = signal('');

  ngOnInit(): void {
    this.requestOtpForm = this.formBuiilder.group({
      email: ['', [Validators.required, emailValidator]],
    });

    this.requestOtpForm.valueChanges.subscribe(() => {
      this.isFormValid.set(this.requestOtpForm.valid);
      this.showNonExistingUserError.set(false);
    });
  }

  onSubmit() {
    this.onRequestStart();

    const requestBody = {
      email: this.requestOtpForm.get('email')?.value,
    };

    this.authApiService.handleOtpRequest(requestBody).subscribe({
      next: () => this.handleSuccessResponse(),
      error: (response: HttpErrorResponse) =>
        this.handleErrorResponse(response),
    });
  }

  async handleSuccessResponse() {
    this.onRequestEnd();
    this.saveEmail();

    await this.router.navigate([
      CLIENT_ENDPOINTS.OTP_VERIFICATION,
      VERIFICATION_SCENARIO.PASSWORD_RESET,
    ]);
  }

  handleErrorResponse(response: HttpErrorResponse) {
    this.onRequestEnd();
    const errorMessage = response.error.message;
    this.httpErrorResponse.set(errorMessage);
    this.showNonExistingUserError.set(true);
  }

  saveEmail() {
    globalThis.window.localStorage.setItem(
      STORAGE_KEYS.EMAIL,
      this.requestOtpForm.value.email
    );
  }

  onRequestStart() {
    this.isMakingRequest.set(true);
  }

  onRequestEnd() {
    this.isMakingRequest.set(false);
  }

  get emailRequired() {
    return (
      this.requestOtpForm.get('email')?.touched &&
      this.requestOtpForm.get('email')?.hasError('required')
    );
  }

  get emailPatternInvalid() {
    return (
      this.requestOtpForm.get('email')?.touched &&
      this.requestOtpForm.get('email')?.hasError('email')
    );
  }
}
