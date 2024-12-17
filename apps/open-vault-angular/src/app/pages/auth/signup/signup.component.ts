import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActionBtnComponent } from '../../../shared/components/action-btn/action-btn.component';
import { FormControlComponent } from '../../../shared/components/form-control/form-control.component';
import { InvalidInputMessageComponent } from '../../../shared/components/invalid-input-message/invalid-input-message.component';
import { OpenVaultBannerComponent } from "../../../shared/components/open-vault-banner/open-vault-banner.component";
import { STORAGE_KEYS } from '../../../shared/constants';
import { RedirectionResponseData, ResponseObject } from '../../../shared/types';
import { emailValidator } from '../../../shared/validators/email.validator';
import { passwordMatch } from '../../../shared/validators/password-match.validator';
import { AuthApiService } from '../shared/services/auth-api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ActionBtnComponent,
    FormControlComponent,
    InvalidInputMessageComponent,
    ReactiveFormsModule,
    RouterModule,
    OpenVaultBannerComponent
  ],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  authApiService = inject(AuthApiService);
  router = inject(Router);
  signupForm!: FormGroup;
  isSubmitEnabled = signal(false);
  showHttpErrorResponse = signal(false);
  httpErrorMessage = signal('');
  isMakingRequest = signal(false);
  isSignupSuccessful = signal(false);

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
    this.signupForm.addValidators(passwordMatch);
    this.signupForm?.valueChanges.subscribe(() =>
      this.isSubmitEnabled.set(this.signupForm.valid)
    );
  }

  onSignup() {
    this.onRequestStart();

    const formValue = this.signupForm.value;
    const requestBody = {
      email: formValue.email,
      password: formValue.password,
      isSocialLogin: false,
    };
    this.authApiService.handleSignup(requestBody).subscribe({
      next: (response: object) => this.handleSuccessResponse(response),
      error: (response: HttpErrorResponse) =>
        this.handleErrorResponse(response),
    });
  }

  async handleSuccessResponse(_response: object) {
    this.isSubmitEnabled.set(false);
    this.isMakingRequest.set(true); // done to hide the redirect link to the signin page

    const response = _response as ResponseObject;

    this.saveEmail();
    this.isSignupSuccessful.set(true);

    const {redirectTo, scenario} = (response.data as RedirectionResponseData)

    await this.router.navigateByUrl(`${redirectTo}/${scenario}`);
  }

  handleErrorResponse(response: HttpErrorResponse) {
    console.log(response);
    this.onRequestEnd();
    this.showHttpErrorResponse.set(true);
    this.httpErrorMessage.set(response.error.message);
  }

  saveEmail() {
    localStorage.setItem(STORAGE_KEYS.EMAIL, this.signupForm.value.email);
  }

  onRequestStart() {
    this.isMakingRequest.set(true);
    this.showHttpErrorResponse.set(false);
    this.isSubmitEnabled.set(false);
  }

  onRequestEnd() {
    this.isMakingRequest.set(false);
    this.isSubmitEnabled.set(true);
  }

  get emailRequired() {
    return (
      this.signupForm.get('email')?.touched &&
      this.signupForm.get('email')?.hasError('required')
    );
  }

  get emailPatternInvalid() {
    return (
      this.signupForm.get('email')?.touched &&
      this.signupForm.get('email')?.hasError('email')
    );
  }

  get passwordRequired() {
    return (
      this.signupForm.get('password')?.touched &&
      this.signupForm.get('password')?.hasError('required')
    );
  }

  get passwordTooShort() {
    return (
      this.signupForm.get('password')?.touched &&
      this.signupForm.get('password')?.hasError('minlength')
    );
  }

  get confirmPasswordRequired() {
    return (
      this.signupForm.get('confirmPassword')?.touched &&
      this.signupForm.get('confirmPassword')?.hasError('required')
    );
  }

  get passwordMismatch() {
    return (
      this.signupForm.get('confirmPassword')?.touched &&
      this.signupForm.hasError('passwordMismatch')
    );
  }
}
