import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActionBtnComponent } from '../../../shared/components/action-btn/action-btn.component';
import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { InvalidInputMessageComponent } from '../../../shared/components/invalid-input-message/invalid-input-message.component';
import { MessageDisplayComponent } from '../../../shared/components/message-display/message-display.component';
import { AuthApiService } from '../shared/services/auth-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordMatch } from '../../../shared/validators/password-match.validator';
import { PasswordReset, ResponseObject } from '../../../shared/types';
import { HttpErrorResponse } from '@angular/common/http';
import { CLIENT_ENDPOINTS, REDIRECTION_TIMEOUT, STORAGE_KEYS } from '../../../shared/constants';
import { OpenVaultBannerComponent } from "../../../shared/components/open-vault-banner/open-vault-banner.component";


@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    ActionBtnComponent,
    CommonModule,
    FormControlComponent,
    InvalidInputMessageComponent,
    MessageDisplayComponent,
    ReactiveFormsModule,
    OpenVaultBannerComponent
],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  authApiService = inject(AuthApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  message = signal('Set a new password');
  showMessage = signal(false);

  passwordResetForm!: FormGroup;
  isSubmitEnabled = signal(false);
  isMakingRequest = signal(false);
  showHttpErrorResponse = signal(false);
  showSuccessfulPasswordResetNotif = signal(false);
  httpErrorMessage = signal('');

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((qparams) => {
      const message = qparams.get('message');
      if (message) {
        this.message.set(message);
        this.showMessage.set(true);
      }
    });

    this.passwordResetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
    this.passwordResetForm.addValidators(passwordMatch);
    this.passwordResetForm.valueChanges.subscribe(() =>
      this.isSubmitEnabled.set(this.passwordResetForm.valid)
    );
  }

  onApply() {
    this.onRequestStart();

    const requestBody = {
      email: this.getEmail(),
      password: this.passwordResetForm.get('password')?.value,
    } as PasswordReset;

    this.authApiService.handlePasswordReset(requestBody).subscribe({
      next: (response: any) => this.handleSuccessResponse(response),
      error: (response: HttpErrorResponse) =>
        this.handleErrorResponse(response),
    });
  }

  handleSuccessResponse(response: ResponseObject) {
    this.onRequestEnd();
    this.showSuccessfulPasswordResetNotif.set(true);

    setTimeout(async () => {
      await this.router.navigateByUrl(CLIENT_ENDPOINTS.SIGNIN);
    }, REDIRECTION_TIMEOUT);
  }

  onRequestStart() {
    this.isMakingRequest.set(true);
    this.isSubmitEnabled.set(false);
    this.showHttpErrorResponse.set(false);
  }

  onRequestEnd() {
    this.isMakingRequest.set(false);
  }

  handleErrorResponse(response: HttpErrorResponse) {
    this.onRequestEnd();
    this.httpErrorMessage.set(response.error.message);
    this.showHttpErrorResponse.set(true);
  }

  getEmail() {
    return globalThis.window.localStorage.getItem(STORAGE_KEYS.EMAIL);
  }  

  get passwordRequired() {
    return (
      this.passwordResetForm.get('password')?.touched &&
      this.passwordResetForm.get('password')?.hasError('required')
    );
  }

  get passwordTooShort() {
    return (
      this.passwordResetForm.get('password')?.touched &&
      this.passwordResetForm.get('password')?.hasError('minlength')
    );
  }

  get confirmPasswordRequired() {
    return (
      this.passwordResetForm.get('confirmPassword')?.touched &&
      this.passwordResetForm.get('confirmPassword')?.hasError('required')
    );
  }

  get passwordMismatch() {
    console.log(this.passwordResetForm.hasError('passwordMismatch'));
    return (
      this.passwordResetForm.get('confirmPassword')?.touched &&
      this.passwordResetForm.hasError('passwordMismatch')
    );
  }
}
